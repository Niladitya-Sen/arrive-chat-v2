"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { HiHome } from 'react-icons/hi2';
import { BsFillBellFill, BsPersonFill } from 'react-icons/bs';
import { useSearchParams, usePathname, useRouter, useParams } from 'next/navigation';
import { useChatSidebarNavigation } from '@/store/ChatSidebarNavigation';
import { cn } from '@/lib/utils';
import { CgClose } from 'react-icons/cg';
import { HiMenuAlt2 } from 'react-icons/hi';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';
import { useCaptainRoomSidebar } from '@/store/CaptainRoomSidebar';
import { IoPersonAdd } from 'react-icons/io5';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../ui/dialog';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import ChatHeader from './ChatHeader';
import { Playfair_Display } from "next/font/google";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAlertStore } from '@/store/AlertStore';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { LuLogOut } from "react-icons/lu";
import { useCookies } from '@/hooks/useCookies';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ToolTipProvider from './ToolTipProvider';
import { MdOutlineSupportAgent } from 'react-icons/md';

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
    const params = useParams();
    const isOpen = useChatSidebarNavigation(state => state.isOpen);
    const roomSideBar = useCaptainRoomSidebar(state => state);
    const toggleSidebar = useChatSidebarNavigation(state => state.toggle);
    const toggleServicesSidebar = useServicesSidebarNavigation(state => state.toggle);
    const router = useRouter();
    const { openAlert, closeAlert } = useAlertStore(state => state);
    const dialogCloseRef = React.useRef<HTMLButtonElement>(null);
    const [dict, setDict] = useState<{ [key: string]: { [key: string]: string; }; }>({});
    const cookies = useCookies();

    useEffect(() => {
        (async () => {
            const dict = await getDictionary(params.lang as string);
            setDict(dict);
        })();
    }, []);

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
                    if (searchParams.get("sb") === "support") {
                        router.push(`/${params.lang}/captain/chat`)
                    }
                    if (pathname.includes(`/${params.lang}/captain/chat`)) {
                        toggleSidebar();
                        toggleServicesSidebar();
                    } else {
                        router.push(`/${params.lang}/captain/chat`)
                    }
                }}
                className={cn(`flex sm:flex-col gap-2 items-center ${!pathname.includes('services') ? 'text-primary' : 'text-black'}`)}>
                <HiHome className='text-2xl' />
                <p className='text-sm'>{dict?.sidebar?.Home}</p>
            </button>
            <Link
                href={{
                    pathname: `/${params.lang}/captain/notifications`
                }}
                onClick={toggleSidebar}
                className={cn(`flex sm:flex-col gap-2 items-center ${!pathname.includes('notifications') ? 'text-primary' : 'text-black'}`)}>
                <BsFillBellFill className='text-2xl' />
                <p className='text-sm text-center'>{"SOS " + dict?.sidebar?.Notifications}</p>
            </Link>
            <button
                className={`flex sm:flex-col gap-2 items-center`}
                onClick={() => {
                    if (pathname.includes(`/${params.lang}/captain/profile`)) {
                        toggleSidebar();
                        toggleServicesSidebar();
                    } else {
                        router.push(`/${params.lang}/captain/profile`);
                    }
                }}
            >
                <BsPersonFill className="text-2xl text-primary" />
                <p className='text-sm text-primary'>{dict?.sidebar?.Profile}</p>
            </button>
            <button
                className={`flex sm:flex-col gap-2 items-center`}
                onClick={() => {
                    roomSideBar.open();
                    
                    if (searchParams.get('sb') === 'support') {
                        router.push(`/${params.lang}/captain/chat`);
                    }

                    if (!pathname.includes(`/${params.lang}/captain/chat`)) {
                        router.push(`/${params.lang}/captain/chat`);
                    }
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 6V21H3V19H5V3H14V4H19V19H21V21H17V6H14ZM10 11V13H12V11H10Z" fill="#615641" />
                </svg>
                <p className='text-sm text-primary'>{dict?.chatPage?.serviceRequests}</p>
            </button>
            <ToolTipProvider text='Check in or check out support'>
                <Link href={{
                    pathname: !pathname.includes(`/${params.lang}/captain/chat`) ? `/${params.lang}/captain/chat` : '',
                    query: {
                        sb: 'support'
                    }
                }}
                    onClick={() => {
                        roomSideBar.open()
                    }} className='text-center flex sm:flex-col items-center justify-center text-primary'>
                    <MdOutlineSupportAgent className='text-3xl' />
                    <p>Support</p>
                </Link>
            </ToolTipProvider>
            <Dialog>
                <DialogTrigger asChild>
                    <button className={`flex sm:flex-col gap-2 items-center text-primary text-sm`}>
                        <IoPersonAdd className="text-2xl" />
                        <p>{dict?.sidebar?.["Add Customer"]}</p>
                    </button>
                </DialogTrigger>
                <DialogContent className={cn('p-0 overflow-hidden max-w-2xl bg-[#2f2f2f]')}>
                    <ChatHeader />
                    <h1 className={`${playfair_Display.className} text-2xl text-center`}>{dict?.captain?.customerDetailsForm}</h1>
                    <form
                        className='grid grid-cols-2 px-16 py-8 gap-4'
                        onSubmit={handleSubmit}
                    >
                        <div className='w-full'>
                            <label htmlFor="first_name" className='text-sm'>{dict?.captain?.fname}</label>
                            <Input
                                required
                                id='first_name'
                                name="fname"
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="last_name" className='text-sm'>{dict?.captain?.lname}</label>
                            <Input
                                required
                                name="lname"
                                id='last_name'
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="email" className='text-sm'>{dict?.captain?.email}</label>
                            <Input
                                required
                                name="email"
                                id='email'
                                type='email'
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="phoneno" className='text-sm'>{dict?.captain?.number}</label>
                            <Input
                                required
                                name="phone_number"
                                id='phoneno'
                                pattern='[0-9]{10}'
                                maxLength={10}
                                minLength={10}
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                            {/* <PhoneInput     
                                country={'ae'}                           
                                inputProps={{
                                    required: true,
                                    pattern: '[0-9]{10}',
                                    maxLength: 10,
                                    minLength: 10, 
                                    name: 'phone_number',                                   
                                }}
                                containerClass='w-full bg-transparent !border-0 !border-b-2 !border-gray-500 !rounded-none pl-0 font-semibold text-base'
                                inputClass='!bg-transparent !w-full py-[0.6rem] !border-0'
                                specialLabel=''
                                showDropdown
                                dropdownClass='!bg-[#2f2f2f]'
                                buttonStyle={{ 
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                }}
                                countryCodeEditable={false}
                            /> */}
                        </div>
                        <div className='w-full'>
                            <label htmlFor="checkin" className='text-sm'>{dict?.captain?.checkin}</label>
                            <Input
                                required
                                name="arrival_date"
                                id='checkin'
                                type='date'
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="checkout" className='text-sm'>{dict?.captain?.checkout}</label>
                            <Input
                                required
                                name="departure_date"
                                id='checkout'
                                type='date'
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="bookingid" className='text-sm'>{dict?.captain?.booking}</label>
                            <Input
                                required
                                name="unique_id"
                                id='bookingid'
                                className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                            />
                        </div>
                        <Button className={cn('col-span-2 w-fit place-self-center')} size="lg">{dict?.captain?.submit}</Button>
                    </form>
                </DialogContent>
                <DialogClose ref={dialogCloseRef} />
            </Dialog>
            <Dialog>
                <DialogTrigger asChild>
                    <button className={`flex sm:flex-col gap-2 items-center -mt-6`}>
                        <LuLogOut className="text-2xl text-primary" />
                        <p className='text-sm text-primary'>{dict?.chatPage?.signOut}</p>
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <p className={`${playfair_Display.className} text-xl text-center mb-4`}>{dict?.sidebar?.confirmSignOut}</p>
                    </DialogHeader>
                    <DialogFooter className={cn('sm:justify-center')}>
                        <div className='flex flex-col gap-2'>
                            <Button type="button" variant="secondary" size="lg" className={cn('rounded-none border-2 border-primary')}
                                onClick={() => {
                                    localStorage.removeItem('ac_ut');
                                    cookies.deleteCookie('language');
                                    cookies.deleteCookie('token');
                                    window.location.href = "/captain";
                                }}
                            >
                                {dict?.sidebar?.yesSure}
                            </Button>
                            <Button type="button" variant="ghost" size="sm" className={cn('rounded-none')}
                                onClick={() => {
                                    dialogCloseRef.current?.click();
                                }}
                            >
                                {dict?.sidebar?.notNow}
                            </Button>
                        </div>
                        <DialogClose ref={dialogCloseRef} className="hidden"></DialogClose>
                    </DialogFooter>
                </DialogContent>
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
