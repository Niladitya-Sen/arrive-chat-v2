"use client";

import Image from 'next/image';
import React, { useEffect } from 'react'
import ChatBubble from './ChatBubble';
import { MessageType } from '@/types/types';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import socket from '@/socket/socket';

export default function Chat({ isBot, isCaptainConnected, firstMessage, isCaptain }: Readonly<{ isBot?: boolean, isCaptainConnected?: boolean, firstMessage?: string, isCaptain?: boolean }>) {
    const chatAreaRef = React.useRef<HTMLDivElement>(null);
    const chatInputRef = React.useRef<HTMLInputElement>(null);
    const [messages, setMessages] = React.useState<MessageType[]>(firstMessage ? [{
        message: firstMessage, role: 'system', time: new Date().toLocaleTimeString(
            'en-US',
            { hour: 'numeric', minute: 'numeric', hour12: true },
        ),
    }] : []);

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
                    message: 'Hi, I am Arrive Bot. How can I help you?',
                    role: 'captain',
                    time: new Date().toLocaleTimeString(
                        'en-US',
                        { hour: 'numeric', minute: 'numeric', hour12: true },
                    )
                }
            ]);
        } else if (isCaptain) {
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
            console.log(data);
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
    })

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
            if (message.toLowerCase() === "hello" || message.toLowerCase() === "hi" || message.toLowerCase() === "hey") {
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
            } else {
                console.log("message", message);
                socket.emit("bot_chat", { message });
            }
            chatInputRef.current.value = '';
        }
    }

    return (
        <section
            className='relative isolate max-w-4xl w-full mx-auto mt-4 p-2 flex flex-col'
        >
            <div
                ref={chatAreaRef}
                className='flex-grow flex flex-col gap-2 overflow-y-auto h-full scrollbar-none'
            >
                {messages.map((message, index) => (
                    <ChatBubble key={index} message={message.message} role={message.role} time={message.time} />
                ))}
            </div>
            <form
                className='sticky bottom-4 bg-white p-2 rounded-full flex flex-row border-[1.25px] border-black my-4 sm:mb-0'
                onSubmit={addToMessages}
            >
                <Image
                    src="/smallGirl.png"
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
                    placeholder='Talk with arrive chat'
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
