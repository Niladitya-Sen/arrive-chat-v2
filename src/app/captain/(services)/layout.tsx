"use client";

import CaptainRoomsSidebar from '@/components/custom/CaptainRoomsSidebar';
import CaptainServicesSidebar from '@/components/custom/CaptainServicesSidebar';
import { cn } from '@/lib/utils';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';
import React from 'react';

export default function CaptainChatLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const isOpen = useServicesSidebarNavigation(state => state.isOpen);

    return (
        <React.Fragment>
            <CaptainServicesSidebar />
            <CaptainRoomsSidebar />
            <div className={cn('w-full h-screen', {
                'hidden': isOpen,
                'block': !isOpen,
            })}>
                {children}
            </div>
        </React.Fragment>
    )
}
