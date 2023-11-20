"use client";

import React, { useEffect } from 'react';
import ChatLayout from '@/components/custom/ChatLayout';
import { useServicesStore } from '@/store/CaptainStore';
import { useSearchParams } from 'next/navigation';

export default function Chat() {
    const { setServices, resetServices } = useServicesStore(state => state);
    const searchParams = useSearchParams();

    useEffect(() => {
        async function fetchServices() {
            const response = await fetch(`http://localhost:3013/get-services-by-room/${searchParams.get('rno')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });
            const result = await response.json();
            if (result.success) {
                let services: string[] = [];
                for (let i = 0; i < result.services.length; i++) {
                    services.push(result.services[i].service);
                }
                //resetServices();
                setServices([...services]);
            }
        }
        if (searchParams.get('rno')) {
            fetchServices();
        }
    }, [searchParams.get('rno')])

    return (
        <ChatLayout isCaptain />
    )
}
