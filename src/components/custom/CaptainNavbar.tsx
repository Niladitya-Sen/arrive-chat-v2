"use client";

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '../ui/button'
import { BsPerson } from 'react-icons/bs'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialog'
import Image from 'next/image'
import { Input } from '../ui/input'
import { Playfair_Display } from 'next/font/google'
import { useRouter } from 'next/navigation';

const playfairDisplay = Playfair_Display({
    weight: ['400'],
    style: ['normal'],
    subsets: ['latin-ext'],
    display: 'swap',
});

export default function CaptainNavbar() {
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())
        console.log(data);
        //TODO: api call to login and add jwt token to cookies
        localStorage.setItem('ac_ut', 'captain');
        router.push('/chat');
    }

    return (
        <header>
            <nav className='text-white flex items-center justify-around'>
                <Select>
                    <SelectTrigger className={cn("w-[180px] hidden sm:flex")}>
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                    </SelectContent>
                </Select>
                <div className='flex flex-col items-center justify-center'>
                    <Image
                        src="/arrivechat.png"
                        alt="Arrive Chat"
                        width={202}
                        height={74}
                        priority
                        className='w-[156px] h-[57px]'
                    />
                    <p className='text-2xl'>وصول الدردشة</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <div
                            className={buttonVariants({
                                variant: 'default',
                                className: cn('cursor-pointer flex flex-row items-center justify-between gap-2 uppercase px-5 py-6 text-white')
                            })}
                        >
                            <BsPerson className='text-xl' />
                            <p>Login</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent className={cn("bg-[#2f2f2f] p-10")}>
                        <DialogHeader className={cn("flex flex-row items-center justify-center text-xl font-semibold")}>
                            <h1 className={`${playfairDisplay.className} text-2xl`}>Login to Arrive Chat</h1>
                        </DialogHeader>
                        <form
                            className='flex flex-col gap-4 mt-8'
                            onSubmit={handleSubmit}
                        >
                            <Input
                                type='text'
                                name='name'
                                required
                                className={cn('bg-transparent border-0 border-b-2 border-white rounded-none pl-0 placeholder:text-white placeholder:uppercase')}
                                placeholder='Name'
                            />
                            <Input
                                type='text'
                                name='employeeId'
                                required
                                className={cn('bg-transparent border-0 border-b-2 border-white rounded-none pl-0 placeholder:text-white placeholder:uppercase')}
                                placeholder='Employee ID'
                            />
                            <Select required name="language">
                                <SelectTrigger className={cn('bg-transparent border-0 border-b-2 border-white rounded-none pl-0 placeholder:text-white placeholder:uppercase')}>
                                    <SelectValue placeholder="PREFERRED LANGUAGE" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="french">French</SelectItem>
                                    <SelectItem value="german">German</SelectItem>
                                    <SelectItem value="spanish">Spanish</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type='password'
                                name='password'
                                required
                                className={cn('bg-transparent border-0 border-b-2 border-white rounded-none pl-0 placeholder:text-white placeholder:uppercase')}
                                placeholder='Password'
                            />
                            <Button
                                size={'lg'}
                                className={cn('mt-8 self-center bg-[#1c1c1c] text-white uppercase rounded-none px-14 py-6 border-2 border-[#615641] hover:bg-[#615641]')}
                            >Login</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </nav>
        </header>
    )
}
