import { cn } from '@/lib/utils'
import React from 'react';

export default function ChatBubble({ message, role, time, type }: Readonly<{ message: string, role: "sender" | "system" | "captain", time?: string, type?: "choice" }>) {
    return (
        <div
            className={cn("flex flex-row items-center gap-2", {
                'justify-center': role === 'system',
                'justify-end': role === 'sender',
                'justify-start': role === 'captain',
            })}
        >
            <div
                className={cn("relative isolate bg-white px-4 py-2 rounded-2xl flex flex-col gap-1 items-start max-w-[28rem]", {
                    'rounded-2xl text-black': role === 'system',
                    'rounded-br-none bg-primary text-white': role === 'sender',
                    'rounded-bl-none bg-[#f3dfc5] text-primary-foreground': role === 'captain',
                })}
            >
                <p>{message}</p>
                <div
                    className={cn("text-xs self-end flex justify-end items-center w-full gap-2", {
                        'hidden': role === 'system',
                        'text-white/80': role === 'sender',
                        'text-black/80': role === 'captain',
                    })}
                >
                    <p>{time}</p>
                </div>
            </div>
        </div>
    )
}