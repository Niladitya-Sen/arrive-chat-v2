"use client";

import { useCookies } from '@/hooks/useCookies';
import Image from 'next/image'
import React from 'react'

export default function ServiceCard({ title, image, dialogRef }: Readonly<{
    title: string, image: string, dialogRef: React.RefObject<HTMLDialogElement>
}>) {
    const cookies = useCookies();
    return (
        <div role='button' className='w-full h-full rounded-2xl flex flex-col overflow-hidden' onClick={() => {
            if (!cookies.getCookie("roomno")) {
                dialogRef.current?.showModal();
            }
        }}>
            <Image
                src={image}
                alt={title}
                loading='lazy'
                priority={false}
                placeholder='empty'
                width={200}
                height={200}
                className='object-cover flex-grow'
            />
            <div className='bg-[#b3a385] p-2 h-full text-center'>
                <p className='text-xs text-white font-semibold uppercase'>{title}</p>
            </div>
        </div>
    )
}