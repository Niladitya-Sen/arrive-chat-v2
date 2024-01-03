"use client";

import CaptainRoomsSidebar from '@/components/custom/CaptainRoomsSidebar';
import CaptainServicesSidebar from '@/components/custom/CaptainServicesSidebar';
import { cn } from '@/lib/utils';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';
import React, { useEffect } from 'react';
import socket from '@/socket/socket';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'next/navigation';

export default function CaptainChatLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const isOpen = useServicesSidebarNavigation(state => state.isOpen);
    const { toast } = useToast();
    const params = useParams();
    
    useEffect(() => {
        socket.on("sos-notification", ({ message }: { message: string }) => {
            toast({
                title: "SOS",
                description: message,
            });
        });
    });

    useEffect(() => {
        socket.on("get-captain-language", ({ message, type, roomno, sessionId }) => {
            socket.emit("captain-language", { language: params.lang, message, roomno: roomno, type, sessionId });
        });

        return () => {
            socket.off("get-captain-language");
        };
    });

    return (
        <React.Fragment>
            <CaptainServicesSidebar />
            <CaptainRoomsSidebar />
            <div className={cn('w-full h-screen', {
                'hidden sm:block': isOpen,
                'block': !isOpen,
            })}>
                {children}
            </div>
        </React.Fragment>
    )
}
