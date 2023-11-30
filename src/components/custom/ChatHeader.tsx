import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

export default function ChatHeader() {
    return (
        <nav
            className={cn("text-white flex flex-col items-center justify-center bg-primary p-2")}
        >
            <Image
                src="/img/arrivechat.png"
                alt="Arrive Chat"
                width={202}
                height={74}
                className='w-[156px] h-[57px]'
            />
            <p className='text-2xl'>وصول الدردشة</p>
        </nav>
    )
}
