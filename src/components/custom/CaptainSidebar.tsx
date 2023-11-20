"use client";

import Link from 'next/link';
import React from 'react';
import { HiHome } from 'react-icons/hi2';
import { BsFillBellFill, BsPersonFill } from 'react-icons/bs';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useChatSidebarNavigation } from '@/store/ChatSidebarNavigation';
import { cn } from '@/lib/utils';
import { CgClose } from 'react-icons/cg';
import { HiMenuAlt2 } from 'react-icons/hi';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';
import { useCaptainRoomSidebar } from '@/store/CaptainRoomSidebar';
import { IoPersonAdd } from 'react-icons/io5';
import { Dialog, DialogContent } from '../ui/dialog';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import ChatHeader from './ChatHeader';
import { Playfair_Display } from "next/font/google";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAlertStore } from '@/store/AlertStore';

const playfair_Display = Playfair_Display({
    weight: "400",
    style: "normal",
    subsets: ["latin-ext"],
});

type AddCustomerFormDataType = {
    fname: string;
    lname: string;
    email: string;
    phone_number: string;
    arrival_date: string;
    departure_date: string;
    unique_id: string;
}

type AddCustomerResponseType = {
    success: boolean;
    message?: string;
    error?: string;
}

export default function CaptainSidebar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isOpen = useChatSidebarNavigation(state => state.isOpen);
    const toggleRoomSidebar = useCaptainRoomSidebar(state => state.toggle);
    const toggleSidebar = useChatSidebarNavigation(state => state.toggle);
    const toggleServicesSidebar = useServicesSidebarNavigation(state => state.toggle);
    const router = useRouter();
    const { openAlert, closeAlert } = useAlertStore(state => state);
    const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        dialogCloseRef.current?.click();
        openAlert('Adding customer...', 'details');
        const form = e.currentTarget;
        const formData = new FormData(form);
        const bodyContent: AddCustomerFormDataType = Object.fromEntries(formData.entries()) as AddCustomerFormDataType;
        const response = await fetch('https://ae.arrive.waysdatalabs.com/api/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: bodyContent.fname + ' ' + bodyContent.lname,
                ...bodyContent,
            })
        });
        const data: AddCustomerResponseType = await response.json();
        if (data.success) {
            openAlert(data.message as string, 'success');
            setTimeout(() => {
                closeAlert();
            }, 3000);
        } else {
            openAlert(data.error as string, 'error');
            setTimeout(() => {
                closeAlert();
            }, 3000);
        }
    }

    return (
        <section
            className={cn('sm:static sm:w-auto sm:bg-transparent sm:shadow-none sm:flex flex-col sm:items-center p-6 gap-6 transition-all duration-300', {
                'absolute z-50 bg-white h-full w-[300px] shadow-lg flex items-start': isOpen,
                'hidden': !isOpen
            })}
        >
            <button
                className='text-xl rounded-full bg-primary p-2 w-fit text-white self-end block sm:hidden'
                onClick={toggleSidebar}
            >
                <CgClose />
            </button>
            <button
                onClick={() => {
                    if (pathname.includes('/captain/chat')) {
                        toggleSidebar();
                        toggleServicesSidebar();
                    } else {
                        router.push(`/captain/chat?language=${searchParams.get('language')}`)
                    }
                }}
                className={cn(`flex sm:flex-col gap-2 items-center ${!pathname.includes('services') ? 'text-primary' : 'text-black'}`)}>
                <HiHome className='text-2xl' />
                <p className='text-sm'>Home</p>
            </button>
            <Link
                href={{
                    pathname: '/captain/notifications',
                    query: {
                        language: searchParams.get('language')
                    }
                }}
                onClick={toggleSidebar}
                className={cn(`flex sm:flex-col gap-2 items-center ${!pathname.includes('notifications') ? 'text-primary' : 'text-black'}`)}>
                <BsFillBellFill className='text-2xl' />
                <p className='text-sm'>Notifications</p>
            </Link>
            <button
                className={`flex sm:flex-col gap-2 items-center`}
                onClick={() => {
                    if (pathname.includes('/captain/profile')) {
                        toggleSidebar();
                        toggleServicesSidebar();
                    } else {
                        router.push("/captain/profile");
                    }
                }}
            >
                <BsPersonFill className="text-2xl text-primary" />
                <p className='text-sm text-primary'>Profile</p>
            </button>
            <button
                className={`flex sm:flex-col gap-2 items-center`}
                onClick={toggleRoomSidebar}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 6V21H3V19H5V3H14V4H19V19H21V21H17V6H14ZM10 11V13H12V11H10Z" fill="#615641" />
                </svg>
                <p className='text-sm text-primary'>Rooms</p>
            </button>
            <Dialog>
                <DialogTrigger asChild>
                    <button className={`flex sm:flex-col gap-2 items-center text-primary text-sm`}>
                        <IoPersonAdd className="text-2xl" />
                        <p>Add Customer</p>
                    </button>
                </DialogTrigger>
                <DialogContent className={cn('p-0 overflow-hidden max-w-2xl bg-[#2f2f2f]')}>
                    <ChatHeader />
                    <h1 className={`${playfair_Display.className} text-2xl text-center`}>Customer Details Form</h1>
                    <form
                        className='grid grid-cols-2 px-16 py-8 gap-4'
                        onSubmit={handleSubmit}
                    >
                        <div className='w-full'>
                            <label htmlFor="first_name" className='text-sm'>First Name</label>
                            <Input
                                required
                                id='first_name'
                                name="fname"
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="last_name" className='text-sm'>Last Name</label>
                            <Input
                                required
                                name="lname"
                                id='last_name'
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="email" className='text-sm'>Email ID</label>
                            <Input
                                required
                                name="email"
                                id='email'
                                type='email'
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="phoneno" className='text-sm'>Mobile Number</label>
                            <Input
                                required
                                name="phone_number"
                                id='phoneno'
                                pattern='[0-9]{10}'
                                maxLength={10}
                                minLength={10}
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="checkin" className='text-sm'>Check In</label>
                            <Input
                                required
                                name="arrival_date"
                                id='checkin'
                                type='date'
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="checkout" className='text-sm'>Check Out</label>
                            <Input
                                required
                                name="departure_date"
                                id='checkout'
                                type='date'
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="bookingid" className='text-sm'>Booking ID</label>
                            <Input
                                required
                                name="unique_id"
                                id='bookingid'
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <Button className={cn('col-span-2 w-fit place-self-center')} size="lg">Submit</Button>
                    </form>
                </DialogContent>
                <DialogClose ref={dialogCloseRef} />
            </Dialog>
        </section>
    )
}

export function CaptainSidebarToggleButton() {
    const toggleSidebar = useChatSidebarNavigation(state => state.toggle);

    return (
        <button
            className='static sm:hidden text-2xl rounded-2xl bg-primary p-4 text-center text-white m-4 w-fit'
            onClick={toggleSidebar}
        >
            <HiMenuAlt2 />
        </button>
    )
}
