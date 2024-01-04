"use client";

import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { HiHome } from 'react-icons/hi2';
import { BsFillBellFill } from 'react-icons/bs';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useChatSidebarNavigation } from '@/store/ChatSidebarNavigation';
import { cn } from '@/lib/utils';
import { CgClose } from 'react-icons/cg';
import { HiMenuAlt2 } from 'react-icons/hi';
import { FaPersonBooth } from 'react-icons/fa';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';
import { useCookies } from '@/hooks/useCookies';
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { BiSupport } from "react-icons/bi";
import ToolTipProvider from './ToolTipProvider';
import { MdOutlineSupportAgent } from "react-icons/md";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import socket from '@/socket/socket';
import { useSOSStore } from '@/store/SOSStore';


export default function Sidebar({ children, dict, lang }: Readonly<{ children?: React.ReactNode, dict: { [key: string]: { [key: string]: string; }; }, lang: string }>) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isOpen = useChatSidebarNavigation(state => state.isOpen);
    const toggleSidebar = useChatSidebarNavigation(state => state.toggle);
    const toggleServicesSidebar = useServicesSidebarNavigation(state => state.toggle);
    const router = useRouter();
    const { Home, Notifications, Services } = dict.sidebar;
    const { notRegisteredUser, close, support, selectSupportType, checkIn, checkOut, clickForSupport } = dict.chatPage;
    const cookies = useCookies();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [supportDialogOpen, setSupportDialogOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const SOS = useSOSStore(state => state);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        dialogRef.current?.close();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const response = await fetch('https://ae.arrive.waysdatalabs.com/api/customer/add-roomno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookies.getCookie('token'),
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
            cookies.setCookie('roomno', data.roomno as string, 365, '/');
            socket.emit('join-room', { roomno: data.roomno });
            socket.emit('add-room-user', { roomno: data.roomno, service: "cab" });
            if (SOS.sos) {
                router.push(`/${lang}/sos`);
            } else {
                router.push("?roomno=" + data.roomno);
            }
            SOS.setSOS(false);
        }
    }

    return (
        <section
            className={cn('sm:static sm:w-auto sm:bg-transparent sm:shadow-none sm:flex flex-col sm:items-center p-6 gap-6 transition-all duration-300', {
                'absolute z-50 bg-white h-full w-[300px] shadow-lg flex items-start': isOpen,
                'hidden': !isOpen
            })}
        >
            <dialog
                id="roomno-dialog"
                ref={dialogRef}
                className={cn('fixed inset-0 z-50 backdrop-blur-sm rounded-md w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full text-white backdrop:bg-black/80 backdrop:backdrop-blur-md')}
                open={false}
            >
                <form
                    className='flex flex-col'
                    onSubmit={handleSubmit}
                >
                    <h1 className='text-lg font-semibold leading-none tracking-tight mb-5'>{dict?.chatPage?.enterRoomNumber}</h1>
                    <Input
                        required
                        type="text"
                        name="roomno"
                        placeholder='Room Number'
                        className='w-full p-2 border-2 border-gray-300 rounded-md'
                    />
                    <Button
                        className={cn('text-white mt-2 w-fit self-end')}
                    >{dict?.chatPage?.startChatWithCaptain}</Button>
                </form>
            </dialog>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-white'>{notRegisteredUser}</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose>
                            <Button>{close}</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <button
                className='text-xl rounded-full bg-primary p-2 w-fit text-white self-end block sm:hidden'
                onClick={toggleSidebar}
            >
                <CgClose />
            </button>
            <button
                onClick={() => {
                    toggleSidebar();
                    router.push(`/${lang}/chat`);
                }}
                className={`flex sm:flex-col gap-2 items-center ${!pathname.includes('chat') ? 'text-primary' : 'text-black'}`}
            >
                <HiHome className='text-2xl' />
                <p className='text-sm'>{Home}</p>
            </button>
            {/* <Link
                href={{
                    pathname: `/${lang}/notifications`,
                    query: {
                        language: searchParams.get('language')
                    }
                }}
                onClick={toggleSidebar}
                className={cn(`flex sm:flex-col gap-2 items-center ${!pathname.includes('notifications') ? 'text-primary' : 'text-black'}`)}>
                <BsFillBellFill className='text-2xl' />
                <p className='text-sm'>{Notifications}</p>
            </Link> */}
            <button
                onClick={() => {
                    if (!cookies.getCookie('token')) {
                        setDialogOpen(true);
                        return;
                    }
                    toggleSidebar();
                    if (pathname.includes('services')) {
                        toggleServicesSidebar();
                    } else {
                        router.push(`/${lang}/services`);
                        toggleServicesSidebar();
                    }
                }}
                className={cn(`flex sm:flex-col gap-2 items-center ${!pathname.includes('services') ? 'text-primary' : 'text-black'}`)}>
                <FaPersonBooth className='text-2xl' />
                <p className='text-sm'>{Services}</p>
            </button>
            <button
                onClick={() => {
                    if (!cookies.getCookie('token')) {
                        setDialogOpen(true);
                        return;
                    } else if (!cookies.getCookie('roomno')) {
                        (document.getElementById("roomno-dialog") as HTMLDialogElement).showModal();
                        return;
                    }
                    toggleSidebar();
                    if (pathname.includes('sos')) {
                        toggleServicesSidebar();
                    } else {
                        router.push(`/${lang}/sos`);
                        toggleServicesSidebar();
                    }
                }}
                className={cn(`flex sm:flex-col gap-2 items-center ${!pathname.includes('sos') ? 'text-primary' : 'text-black'}`)}>
                <BiSupport className='text-2xl' />
                <p className='text-sm'>{"SOS"}</p>
            </button>
            <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
                <DialogTrigger asChild>
                    <span>
                        <ToolTipProvider text={clickForSupport}>
                            <button className='text-center flex sm:flex-col gap-2 items-center justify-center text-primary'>
                                <MdOutlineSupportAgent className='text-3xl' />
                                <p>{support}</p>
                            </button>
                        </ToolTipProvider>
                    </span>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='mb-4'>{selectSupportType}</DialogTitle>
                        <Select onValueChange={(value) => {
                            setSupportDialogOpen(false);
                            const supportType = cookies.getCookie('supportType');
                            const cico_token = cookies.getCookie('cico_token');
                            if (cico_token && supportType === value) {
                                router.push(`/${lang}/cico/chat`);
                                return;
                            }
                            router.push(`/${lang}/auth/${value}`);
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={selectSupportType} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem className='cursor-pointer' value="check-in">{checkIn}</SelectItem>
                                <SelectItem className='cursor-pointer' value="check-out">{checkOut}</SelectItem>
                            </SelectContent>
                        </Select>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            {children}
        </section>
    )
}

export function SidebarToggleButton() {
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
