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

export default function CaptainSidebar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isOpen = useChatSidebarNavigation(state => state.isOpen);
    const { isRoomOpen, toggleRoomSidebar } = useCaptainRoomSidebar(state => { return { isRoomOpen: state.isOpen, toggleRoomSidebar: state.toggle } });
    const toggleSidebar = useChatSidebarNavigation(state => state.toggle);
    const toggleServicesSidebar = useServicesSidebarNavigation(state => state.toggle);
    const router = useRouter();

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
