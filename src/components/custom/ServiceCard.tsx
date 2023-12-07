"use client";

import { useCookies } from '@/hooks/useCookies';
import { useSelectedServiceStore } from '@/store/SelectedServiceStore';
import Image from 'next/image'
import React from 'react'

export default function ServiceCard({ title, image, dialogRef }: Readonly<{
    title: string, image: string, dialogRef: React.RefObject<HTMLDialogElement>
}>) {
    const cookies = useCookies();
    const serviceStore = useSelectedServiceStore();
    return (
        <div className='w-full h-full rounded-2xl flex flex-col overflow-hidden' onClick={() => {
            if (!cookies.getCookie("roomno")) {
                dialogRef.current?.showModal();
            }
            serviceStore.setSelectedService(title);
        }}>
            <Image
                src={image}
                alt={"service"}
                width={200}
                height={200}
                className='object-cover flex-grow w-full'
            />
            <div className='bg-[#b3a385] p-2 h-full text-center'>
                <p className='text-xs text-white font-semibold uppercase'>{title}</p>
            </div>
        </div>
    )
}