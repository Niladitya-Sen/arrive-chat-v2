"use client";

import Link from 'next/link';
import React, { useState } from 'react';
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

    return (
        <section
            className={cn('sm:static sm:w-auto sm:bg-transparent sm:shadow-none sm:flex flex-col sm:items-center p-6 gap-6 transition-all duration-300', {
                'absolute z-50 bg-white h-full w-[300px] shadow-lg flex items-start': isOpen,
                'hidden': !isOpen
            })}
        >
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
                    if (!cookies.getCookie('roomno') || !cookies.getCookie('token')) {
                        setDialogOpen(true);
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
