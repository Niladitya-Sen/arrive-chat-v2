"use client";

import Link from 'next/link';
import React from 'react';
import { HiHome } from 'react-icons/hi2';
import { BsFillBellFill } from 'react-icons/bs';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useChatSidebarNavigation } from '@/store/ChatSidebarNavigation';
import { cn } from '@/lib/utils';
import { CgClose } from 'react-icons/cg';
import { HiMenuAlt2 } from 'react-icons/hi';
import { FaPersonBooth } from 'react-icons/fa';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';

export default function Sidebar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isOpen = useChatSidebarNavigation(state => state.isOpen);
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
            <Link
                href={{
                    pathname: '/chat',
                    query: {
                        language: searchParams.get('language')
                    }
                }}
                onClick={toggleSidebar}
                className={`flex sm:flex-col gap-2 items-center ${!pathname.includes('chat') ? 'text-primary' : 'text-black'}`}
            >
                <HiHome className='text-2xl' />
                <p className='text-sm'>Home</p>
            </Link>
            <Link
                href={{
                    pathname: '/notifications',
                    query: {
                        language: searchParams.get('language')
                    }
                }}
                onClick={toggleSidebar}
                className={`flex sm:flex-col gap-2 items-center ${!pathname.includes('notifications') ? 'text-primary' : 'text-black'}`}>
                <BsFillBellFill className='text-2xl' />
                <p className='text-sm'>Notifications</p>
            </Link>
            <button
                onClick={() => {
                    if (pathname.includes('services')) {
                        toggleSidebar();
                        toggleServicesSidebar();
                    } else {
                        router.push(`/services?language=${searchParams.get('language')}`)
                    }
                }}
                className={`flex sm:flex-col gap-2 items-center ${!pathname.includes('services') ? 'text-primary' : 'text-black'}`}>
                <FaPersonBooth className='text-2xl' />
                <p className='text-sm'>Services</p>
            </button>
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