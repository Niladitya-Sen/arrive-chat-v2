import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '../ui/button'
import { BsPerson } from 'react-icons/bs'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'

export default function Navbar() {
    return (
        <header>
            <nav className='text-white flex items-center justify-around'>
                <Select>
                    <SelectTrigger className={cn("w-[180px]")}>
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                    </SelectContent>
                </Select>
                <h1>Arrive Chat</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <div
                            className={buttonVariants({
                                variant: 'default',
                                className: cn('cursor-pointer flex flex-row items-center justify-between gap-2 uppercase px-5 py-6 text-white')
                            })}
                        >
                            <BsPerson className='text-xl' />
                            <p>Login/Sign up</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent className={cn("sm:max-w-md bg-[#2f2f2f] p-10")}>
                        <DialogHeader className={cn("flex flex-row items-center justify-center text-xl font-semibold")}>
                            <h1>Login to Arrive Chat</h1>
                        </DialogHeader>
                        <form className='flex flex-col items-center justify-center gap-4'>
                            <div className='self-stretch'>
                                <label htmlFor="name" className='text-[#7e7c7c] uppercase'>Name</label>
                                <Input
                                    type='text'
                                    name="name"
                                    placeholder='Enter your name'
                                    className={cn('rounded-none border-0 border-b-[1.5px] border-white bg-transparent outline-none px-0')}
                                />
                            </div>
                            <div className='self-stretch'>
                                <label htmlFor="roomid" className='text-[#7e7c7c] uppercase'>Room ID</label>
                                <Input
                                    type='text'
                                    name="roomid"
                                    placeholder='Enter your room ID'
                                    className={cn('rounded-none border-0 border-b-[1.5px] border-white bg-transparent outline-none px-0')}
                                />
                            </div>
                            <div className='self-stretch'>
                                <label htmlFor="bookingid" className='text-[#7e7c7c] uppercase'>Booking ID</label>
                                <Input
                                    type='text'
                                    name="bookingid"
                                    placeholder='Enter your booking ID'
                                    className={cn('rounded-none border-0 border-b-[1.5px] border-white bg-transparent outline-none px-0')}
                                />
                            </div>
                            <Select>
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
                                className={cn('bg-[#1c1c1c] hover:bg-[#1c1c1c]/70 text-white uppercase rounded-none px-14 py-6 border-2 border-[#615641]')}
                            >Login</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </nav>
        </header>
    )
}
