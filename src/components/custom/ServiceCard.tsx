"use client";

import Image from 'next/image'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation';

export default function ServiceCard({ title, image }: Readonly<{ title: string, image: string }>) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        console.log((e.target as any).name, (e.target as any).value);
    }

    return (
        <Dialog open={searchParams.get("roomno") ? false : undefined}>
            <DialogTrigger className='w-full h-full'>
                <div className='w-full h-full rounded-2xl flex flex-col overflow-hidden'>
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
            </DialogTrigger>
            <DialogContent className='w-[500px]'>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Please enter your room number to book this service.
                </DialogDescription>
                <form
                    ref={formRef}
                    className='flex flex-col'
                    onSubmit={handleSubmit}
                >
                    <Input
                        required
                        type="text"
                        name="roomno"
                        placeholder='Room Number'
                        className='w-full p-2 border-2 border-gray-300 rounded-md'
                    />
                    <Button
                        className={cn('text-white mt-2 w-fit self-end')}
                        onClick={() => {
                            formRef.current?.checkValidity()
                                ? formRef.current?.submit()
                                : formRef.current?.reportValidity()
                        }}
                    >Book Now</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
