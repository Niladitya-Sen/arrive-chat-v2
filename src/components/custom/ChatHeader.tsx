import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function ChatHeader() {
    return (
        <nav
            className={cn("text-white bg-primary p-2")}
        >
            <Link href="/" className='flex flex-col items-center justify-center'>
                <Image
                    src="/img/arrivechat.png"
                    alt="Arrive Chat"
                    width={202}
                    height={74}
                    className='w-[156px] h-[57px]'
                />
                <p className='text-2xl'>وصول الدردشة</p>
            </Link>
        </nav>
    )
}
