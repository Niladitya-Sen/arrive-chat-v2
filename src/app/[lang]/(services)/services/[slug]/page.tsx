"use client";

import React, { useEffect } from 'react';
import ChatLayout from '@/components/custom/ChatLayout';
import socket from '@/socket/socket';
import { useCookies } from '@/hooks/useCookies';
import { useSelectedServiceStore } from '@/store/SelectedServiceStore';

export default function Service({ params: { slug } }: Readonly<{ params: { slug: string } }>) {
    const cookies = useCookies();
    const selectedService = useSelectedServiceStore(state => state.selectedService);

    useEffect(() => {
        socket.connect();
        const roomno = cookies.getCookie('roomno');
        if (roomno) {
            socket.emit('join-room', { roomno });
            socket.emit('add-room-user', { roomno: roomno, service: slug });
        }
    }, []);

    return (
        <ChatLayout
            isCaptainConnected
            firstMessage={{
                message: selectedService ?? "",
                role: 'system'
            }}
        />
    )
}
