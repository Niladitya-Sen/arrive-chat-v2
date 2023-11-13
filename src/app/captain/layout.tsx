"use client"

import CaptainSidebar, { CaptainSidebarToggleButton } from '@/components/custom/CaptainSidebar'
import ChatHeader from '@/components/custom/ChatHeader'
import { cn } from '@/lib/utils'
import React from 'react'
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation'
import { useCaptainRoomSidebar } from '@/store/CaptainRoomSidebar'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'


export default function CaptainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const isOpen = useServicesSidebarNavigation(state => state.isOpen);
    const isRoomOpen = useCaptainRoomSidebar(state => state.isOpen);
    const pathname = usePathname();

    return (
        <section className='flex flex-col h-screen'>
            <ChatHeader />
            <div className={cn('grid grid-rows-[6rem_1fr] h-full sm:grid-cols-[8rem_2px_1fr] sm:grid-rows-[100%] text-black relative isolate bg-gradient-to-r from-[#eadec7] via-[#fcf8f0] to-[#eadec7]', {
                'sm:grid-cols-[8rem_2px_1fr]': !isOpen,
                'sm:grid-cols-[8rem_2px_160px_1fr]': !isOpen && isRoomOpen && pathname !== '/captain/profile',
                'sm:grid-cols-[8rem_2px_300px_1fr]': isOpen,
                'sm:grid-cols-[8rem_2px_300px_160px_1fr]': isRoomOpen && isOpen && pathname !== '/captain/profile',
            })}>
                <CaptainSidebarToggleButton />
                <CaptainSidebar />
                <Separator orientation='vertical' className={cn("w-[1.5px] bg-primary hidden sm:block")} />
                {children}
            </div>
        </section>
    )
}