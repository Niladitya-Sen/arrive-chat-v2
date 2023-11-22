"use client";

import React, { useEffect } from 'react';
import ChatLayout from '@/components/custom/ChatLayout'
import { useRoomStore } from '@/store/CaptainStore';

export default function Service({ params }: Readonly<{ params: { slug: string } }>) {
    const { setRooms } = useRoomStore(state => state);

    useEffect(() => {
        async function fetchRooms() {
            const response = await fetch(`https://ae.arrive.waysdatalabs.com/node-api/get-rooms-by-service/${params.slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });
            const result = await response.json();
            if (result.success) {
                let rooms: string[] = [];
                for (const element of result.rooms) {
                    rooms.push(element.room);
                }
                setRooms([...rooms]);
            }
        }
        if (params.slug) {
            fetchRooms();
        }
    }, [params.slug]);

    return (
        <ChatLayout
            firstMessage={{
                message: params.slug,
                role: 'system',
            }}
            isCaptain 
        />
    )
}
