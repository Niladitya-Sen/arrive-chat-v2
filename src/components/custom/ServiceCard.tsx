import Image from 'next/image'
import React from 'react'

export default function ServiceCard({ title, image }: { title: string, image: string }) {
    return (
        <div className='w-full h-full rounded-2xl flex flex-col overflow-hidden'>
            <Image src={image} alt={title} width={200} height={200} className='object-cover flex-grow' />
            <div className='bg-[#b3a385] p-2 h-full text-center'>
                <p className='text-xs text-white font-semibold uppercase'>{title}</p>
            </div>
        </div>
    )
}
