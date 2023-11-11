"use client";

import Image from 'next/image';
import React from 'react'
import ChatBubble from './ChatBubble';
import { MessageType } from '@/types/types';
import { IoPaperPlaneOutline } from 'react-icons/io5';

export default function Chat({ isBot, isCaptainConnected, firstMessage, openModal }: Readonly<{ isBot?: boolean, isCaptainConnected?: boolean, firstMessage?: string, openModal?: boolean }>) {
    const chatAreaRef = React.useRef<HTMLDivElement>(null);
    const chatInputRef = React.useRef<HTMLInputElement>(null);
    const [messages, setMessages] = React.useState<MessageType[]>(firstMessage ? [{ message: firstMessage, role: 'system' }] : []);

    React.useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [messages]);

    function addToMessages(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const message = chatInputRef.current?.value;
        if (message) {
            setMessages((prevMessages) => [...prevMessages, { message, role: 'sender' }, { message: 'Hello', role: 'captain' }, { message: 'How are you?', role: 'system' }]);
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
                    <ChatBubble key={index} message={message.message} role={message.role} />
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
