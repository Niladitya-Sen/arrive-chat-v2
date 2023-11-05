import { cn } from '@/lib/utils'
import React from 'react'

export default function ChatHeader() {
    return (
        <nav
            className={cn("text-white flex items-center justify-around bg-primary p-8")}
        >
            <h1 className='text-2xl'>Arrive Chat</h1>
        </nav>
    )
}
