import React from 'react'
import Image from 'next/image'

export default function Navbar() {
    return (
        <header>
            <nav className='text-white flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Image
                        src="/img/arrivechat.png"
                        alt="Arrive Chat"
                        width={202}
                        height={74}
                        priority
                        className='w-[156px] h-[57px]'
                    />
                    <p className='text-2xl'>وصول الدردشة</p>
                </div>
            </nav>
        </header>
    )
}
