import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '../ui/button'
import { BsPerson } from 'react-icons/bs'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialog'
import Image from 'next/image'

export default function Navbar() {
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
                            <p>Language</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent className={cn("bg-[#2f2f2f] p-10")}>
                        <DialogHeader className={cn("flex flex-row items-center justify-center text-xl font-semibold")}>
                            <h1>Please Choose Language</h1>
                        </DialogHeader>
                        <form action="/chat" className='flex flex-col items-center justify-center gap-4 mt-16'>
                            <Select required name="language">
                                <SelectTrigger className={cn("bg-transparent")}>
                                    <SelectValue placeholder="Preferred Language" />
                                </SelectTrigger>
                                <SelectContent className={cn('bg-[#2f2f2f]')}>
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="french">French</SelectItem>
                                    <SelectItem value="german">German</SelectItem>
                                    <SelectItem value="spanish">Spanish</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                size={'lg'}
                                className={cn('mt-8 bg-[#1c1c1c] text-white uppercase rounded-none px-14 py-6 border-2 border-[#615641] hover:bg-[#615641]')}
                            >Start</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </nav>
        </header>
    )
}
