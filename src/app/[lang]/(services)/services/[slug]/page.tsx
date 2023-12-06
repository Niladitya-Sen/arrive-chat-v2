"use client";

import React, { useEffect } from 'react';
import ChatLayout from '@/components/custom/ChatLayout';
import socket from '@/socket/socket';
import { useCookies } from '@/hooks/useCookies';

export default function Service({ params: { slug } }: Readonly<{ params: { slug: string } }>) {
    const cookies = useCookies();

    useEffect(() => {
        socket.connect();
        const roomno = cookies.getCookie('roomno');
        if (roomno) {
            socket.emit('join-room', { roomno });
            socket.emit('add-room-user', { roomno: roomno, service: slug });
        }
    }, []);

    return (
        <ChatLayout isCaptainConnected />
    )
}
