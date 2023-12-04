"use client";

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import ChatBubble from './ChatBubble';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import socket from '@/socket/socket';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useCookies } from '@/hooks/useCookies';
import useVoiceStore from '@/store/VoiceStore';
import dayjs from 'dayjs';
import { getDictionary } from '@/app/[lang]/dictionaries';

type MessageType = {
    message: string;
    role: 'sender' | 'captain' | 'system' | 'bot';
    time?: string;
    type?: 'choice';
}

export default function Chat({ isBot, isCaptainConnected, firstMessage, isCaptain, dict }: Readonly<{
    isBot?: boolean, isCaptainConnected?: boolean, firstMessage?: MessageType, isCaptain?: boolean, dict?: {
        [key: string]: {
            [key: string]: string;
        };
    }
}>) {
    const chatAreaRef = React.useRef<HTMLDivElement>(null);
    const chatInputRef = React.useRef<HTMLInputElement>(null);
    const [messages, setMessages] = React.useState<MessageType[]>(firstMessage ? [firstMessage] : []);
    const searchParams = useSearchParams();
    const cookies = useCookies();
    const pathname = usePathname();
    const params = useParams();
    const voice = useVoiceStore(state => state);
    const [audioSrc, setAudioSrc] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);
    const [dict1, setDict1] = useState<Record<string, Record<string, string>>>();

    useEffect(() => {
        async function getDict() {
            setDict1(await getDictionary(params.lang as string));
        }
        getDict();
    }, [])

    useEffect(() => {
        async function getBotChats() {
            const response = await fetch(`https://ae.arrive.waysdatalabs.com/node-api/get-bot-messages-by-sessionId/${cookies.getCookie('sessionId')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            });
            const result = await response.json();
            if (result.success) {
                let m: { message: string; role: "captain" | "sender" | "system"; time: string }[] = [];

                for (const key in result.messages) {
                    m.push({
                        message: dayjs(key).isSame(dayjs(), 'day') ? "Today" : dayjs(key).format('DD/MM/YYYY'),
                        role: 'system',
                        time: new Date().toLocaleTimeString(
                            'en-US',
                            { hour: 'numeric', minute: 'numeric', hour12: true },
                        )
                    });
                    for (const element of result.messages[key]) {
                        m.push({
                            message: element.message,
                            role: element.messagedBy === 'bot' ? 'captain' : 'sender',
                            time: element.time
                        });
                    }
                }
                if (m.length !== 0) {
                    setMessages([...m]);
                }
            }
        }
        if (!cookies.getCookie('sessionId') && isBot) {
            cookies.setCookie('sessionId', Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now(), 365, '/');
        }
        if (isBot) {
            getBotChats();
        }
    }, []);

    useEffect(() => {
        const roomno = cookies.getCookie('roomno');
        if (roomno) {
            socket.emit('join-room', { roomno });
        }
    }, [isCaptainConnected]);

    useEffect(() => {
        const roomno = cookies.getCookie('roomno');
        if (roomno) {
            socket.emit('join-room', { roomno });
        }
    }, [pathname]);

    useEffect(() => {
        async function getAudio() {
            try {
                const response = await fetch(`https://ae.arrive.waysdatalabs.com/node-api/get-speech?language=${params.lang}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: messages[messages.length - 1].message })
                });
                const audio = await response.blob();
                setAudioSrc(URL.createObjectURL(audio));
            } catch (error) {
                console.log(error);
            }
        }
        if (isBot && voice.state && messages[messages.length - 1].role !== 'sender') {
            getAudio();
        }
    }, [voice.state, messages.length]);

    useEffect(() => {
        if (!voice.state) {
            audioRef.current?.pause();
            audioRef.current!.currentTime = 0;
        }
        if (audioRef.current && audioSrc && voice.state) {
            audioRef.current.playbackRate = 1.25;
            audioRef.current.play();
        }
    }, [audioSrc]);

    useEffect(() => {
        if (!voice.state) {
            audioRef.current?.pause();
            audioRef.current!.currentTime = 0;
        }
    }, [voice.state]);

    useEffect(() => {
        if (isBot) {
            socket.connect();
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message: new Date().toLocaleTimeString(
                        'en-US',
                        { hour: 'numeric', minute: 'numeric', hour12: true },
                    ), role: 'system'
                },
                {
                    message: dict?.chatPage?.firstMsg ?? "",
                    role: 'captain',
                    time: new Date().toLocaleTimeString(
                        'en-US',
                        { hour: 'numeric', minute: 'numeric', hour12: true },
                    )
                }
            ]);
        } else if (isCaptain) {
            socket.connect();
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message: new Date().toLocaleTimeString(
                        'en-US',
                        { hour: 'numeric', minute: 'numeric', hour12: true },
                    ), role: 'system'
                },
                {
                    message: 'Hello Captain.',
                    role: 'captain',
                    time: new Date().toLocaleTimeString(
                        'en-US',
                        { hour: 'numeric', minute: 'numeric', hour12: true },
                    )
                }
            ]);
        } else if (isCaptainConnected) {
            socket.connect();
        }
    }, []);

    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        socket.on("bot_chat", (data) => {
            let m: { message: string; role: "captain"; time: string }[] = [];
            data.messages.forEach((msg: any) => {
                m.push({
                    message: msg,
                    role: 'captain',
                    time: new Date().toLocaleTimeString(
                        'en-US',
                        { hour: 'numeric', minute: 'numeric', hour12: true },
                    )
                })
            });
            setMessages((prevMessages) => [...prevMessages, ...m]);
        });

        return () => {
            socket.off("bot_chat");
        };
    });

    useEffect(() => {
        socket.on("receive-message", ({ message }: { message: string }) => {
            setMessages((prevMessages) => [...prevMessages, {
                message, role: 'captain', time: new Date().toLocaleTimeString(
                    'en-US',
                    { hour: 'numeric', minute: 'numeric', hour12: true },
                )
            }]);
        });

        return () => {
            socket.off("receive-message");
        };
    });

    useEffect(() => {
        async function getAllChatsByRoom(roomno: string | null) {
            const response = await fetch(`https://ae.arrive.waysdatalabs.com/node-api/get-all-messages-by-room/${roomno}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });
            const result = await response.json();
            if (result.success) {
                let messages: MessageType[] = [];
                for (const key in result.messages) {
                    messages.push({
                        message: dayjs(key).isSame(dayjs(), 'day') ? "Today" : dayjs(key).format('DD/MM/YYYY'),
                        role: 'system',
                        time: new Date().toLocaleTimeString(
                            'en-US',
                            { hour: 'numeric', minute: 'numeric', hour12: true },
                        )
                    });
                    for (const element of result.messages[key]) {
                        if (localStorage.getItem('ac_ut') === 'captain') {
                            if (element.messagedBy === localStorage.getItem('ac_ut')) {
                                messages.push({
                                    message: element.translated_captain,
                                    role: 'sender',
                                    time: element.time
                                });
                            } else {
                                messages.push({
                                    message: element.translated_captain,
                                    role: 'captain',
                                    time: element.time
                                });
                            }
                        } else {
                            if (element.messagedBy === 'captain') {
                                messages.push({
                                    message: element.translated_customer,
                                    role: 'captain',
                                    time: element.time
                                });
                            } else {
                                messages.push({
                                    message: element.translated_customer,
                                    role: 'sender',
                                    time: element.time
                                });
                            }
                        }
                    }
                }
                if (messages.length !== 0) {
                    setMessages([...messages]);
                }
            }
        }
        if (localStorage.getItem('ac_ut') === 'captain' && searchParams.get("rno")) {
            getAllChatsByRoom(searchParams.get("rno"));
        } else if (cookies.getCookie('roomno') && !localStorage.getItem('ac_ut') && !pathname.endsWith('/chat')) {
            getAllChatsByRoom(cookies.getCookie('roomno') ?? "");
        }
    }, [searchParams.get("rno"), pathname]);

    useEffect(() => {
        socket.on("get-captain-language", (message) => {
            socket.emit("captain-language", { language: params.lang, message, roomno: searchParams.get('rno') });
        });

        return () => {
            socket.off("get-captain-language");
        };
    });

    function addToMessages(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const message = chatInputRef.current?.value;
        if (message) {
            setMessages((prevMessages) => [...prevMessages, {
                message, role: 'sender', time: new Date().toLocaleTimeString(
                    'en-US',
                    { hour: 'numeric', minute: 'numeric', hour12: true },
                )
            }]);

            if (isCaptain || isCaptainConnected) {
                socket.emit("send-message", {
                    roomno: searchParams.get('rno') ?? cookies.getCookie('roomno'),
                    message,
                    messagedBy: isCaptainConnected ? 'customer' : 'captain',
                    language: params.lang,
                    time: new Date().toLocaleTimeString(
                        'en-US',
                        { hour: 'numeric', minute: 'numeric', hour12: true },
                    )
                });
            } else if (message.toLowerCase() === "hello" || message.toLowerCase() === "hi" || message.toLowerCase() === "hey") {
                setMessages((prevMessages) => [...prevMessages,
                {
                    message: 'Hello how can I help you?',
                    role: 'captain',
                    time: new Date().toLocaleTimeString(
                        'en-US',
                        { hour: 'numeric', minute: 'numeric', hour12: true },
                    )
                }
                ]);
            } else if (!isCaptain && isBot && cookies.getCookie('sessionId')) {
                socket.emit("bot_chat", {
                    message, sessionId: cookies.getCookie('sessionId')
                });
            }
            chatInputRef.current.value = '';
        }
    }

    return (
        <section
            className='relative isolate max-w-4xl w-full h-screen mx-auto p-2 flex flex-col'
        >
            <audio
                src={audioSrc}
                ref={audioRef}
                autoPlay={false}
            />

            <div
                ref={chatAreaRef}
                className='flex-grow flex flex-col gap-2 overflow-y-auto h-full scrollbar-none'
            >
                {messages.map((message, index) => (
                    <ChatBubble
                        key={index}
                        message={message.message}
                        role={message.role === "bot" ? "captain" : message.role}
                        time={message.time}
                        type={message.type}
                    />
                ))}
            </div>
            <form
                className='sticky bottom-4 bg-white p-2 rounded-full flex flex-row border-[1.25px] border-black my-4 sm:mb-0'
                onSubmit={addToMessages}
            >
                <Image
                    src="/img/smallGirl.png"
                    alt="smallGirl"
                    width={50}
                    height={50}
                    className='rounded-full min-w-[50px]'
                />
                <input
                    ref={chatInputRef}
                    type="text"
                    name="message"
                    id="message"
                    placeholder={dict1?.chatPage?.talkWithArriveChat ?? 'Talk with arrive chat'}
                    className='outline-none flex-grow mx-4 w-full'
                    autoComplete='off'
                />
                <button
                    type="submit"
                    className='bg-white text-black rounded-full border-[1.25px] border-black p-3 text-2xl'
                >
                    <IoPaperPlaneOutline />
                </button>
            </form>
        </section>
    )
}
