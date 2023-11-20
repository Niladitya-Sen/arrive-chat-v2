"use client";

import { cn } from '@/lib/utils'
import { useCaptainRoomSidebar } from '@/store/CaptainRoomSidebar';
import React, { useEffect } from 'react'
import { buttonVariants } from '../ui/button';
import Link from 'next/link';
import socket from '@/socket/socket';
import { useServicesStore } from '@/store/CaptainStore';


export default function CaptainRoomsSidebar() {
    const isRoomOpen = useCaptainRoomSidebar(state => state.isOpen);
    const [roomnumbers, setRoomnumbers] = React.useState<string[]>([]);

    useEffect(() => {
        socket.connect();
    }, []);

    useEffect(() => {
        socket.emit('get-all-rooms-captain');
    }, []);

    useEffect(() => {
        socket.on("get-all-rooms-captain", ({ rooms }: { rooms: { room: string }[] }) => {
            let roomnos: string[] = [];
            for (let i = 0; i < rooms.length; i++) {
                roomnos.push(rooms[i].room);
            }
            setRoomnumbers([...roomnos]);
        });

        return () => {
            socket.off('get-all-rooms-captain');
        }
    })

    useEffect(() => {
        socket.on('add-room-captain', ({ roomno }: { roomno: string }) => {
            console.log("first");
            setRoomnumbers(prev => [...prev, roomno]);
        });

        return () => {
            socket.off('add-room-captain');
        }
    });

    return (
        <section className={cn('border-0 border-r-2 border-primary flex-col gap-2 items-center w-full h-full overflow-y-auto scrollbar-none', {
            'hidden': !isRoomOpen,
            'flex': isRoomOpen
        })}>
            <p className='pb-4 pt-6 text-center'>Room Numbers</p>
            {roomnumbers.map((roomnumber, index) => (
                <Link
                    href={{
                        pathname: '/captain/chat',
                        query: {
                            rno: roomnumber
                        }
                    }}
                    key={index}
                    className={cn(buttonVariants({
                        className: 'self-stretch rounded-none mx-1'
                    }))}
                >{roomnumber}</Link>
            ))}
        </section>
    )
}
