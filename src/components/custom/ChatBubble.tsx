import { cn } from '@/lib/utils'
import type { MessageType } from '@/types/types'
import React from 'react'

export default function ChatBubble({ message, role }: { message: string, role: MessageType['role'] }) {
    return (
        <div
            className={cn("flex flex-row items-center gap-2", {
                'justify-center': role === 'system',
                'justify-end': role === 'sender',
                'justify-start': role === 'captain',
            })}
        >
            <div
                className={cn("bg-white px-4 py-2 rounded-2xl flex flex-col items-start max-w-[28rem]", {
                    'rounded-2xl text-black': role === 'system',
                    'rounded-br-none bg-primary text-white': role === 'sender',
                    'rounded-bl-none bg-[#f3dfc5] text-primary-foreground': role === 'captain',
                })}
            >
                <p>{message}</p>
                <p
                    className={cn("text-xs self-end", {
                        'hidden': role === 'system',
                        'text-white/80': role === 'sender',
                        'text-black/80': role === 'captain',
                    })}
                >10:00 am</p>
            </div>
        </div>
    )
}