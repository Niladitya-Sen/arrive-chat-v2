"use client";

import React, { useEffect } from 'react';
import ChatLayout from '@/components/custom/ChatLayout';
import { useServicesStore } from '@/store/CaptainStore';
import { useSearchParams } from 'next/navigation';
import socket from '@/socket/socket';

export default function Chat() {
    const { setServices, resetServices } = useServicesStore(state => state);
    const searchParams = useSearchParams();

    useEffect(() => {
        async function fetchServices() {
            const response = await fetch(`https://ae.arrive.waysdatalabs.com/node-api/get-services-by-room/${searchParams.get('rno')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });
            const result = await response.json();
            if (result.success) {
                let services: string[] = [];
                for (const element of result.services) {
                    services.push(element.service);
                }
                setServices([...services]);
            }
        }
        if (searchParams.get('rno')) {
            socket.connect();
            socket.emit('join-room', { roomno: searchParams.get('rno') });
            fetchServices();
        } else {
            resetServices();
        }
    }, [searchParams.get('rno')])

    return (
        <ChatLayout isCaptain />
    )
}
