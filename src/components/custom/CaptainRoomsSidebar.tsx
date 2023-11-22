"use client";

import { cn } from '@/lib/utils'
import { useCaptainRoomSidebar } from '@/store/CaptainRoomSidebar';
import React, { useEffect } from 'react'
import { buttonVariants } from '../ui/button';
import Link from 'next/link';
import socket from '@/socket/socket';
import { usePathname, useSearchParams } from 'next/navigation';
import { IoClose } from "react-icons/io5";
import { useRoomStore } from '@/store/CaptainStore';
import { MdDelete } from "react-icons/md";


export default function CaptainRoomsSidebar() {
    const isRoomOpen = useCaptainRoomSidebar(state => state.isOpen);
    //const [roomnumbers, setRoomnumbers] = React.useState<string[]>([]);
    const searchParams = useSearchParams();
    const { rooms, setRooms } = useRoomStore(state => state);
    const pathname = usePathname();

    useEffect(() => {
        socket.connect();
    }, []);

    useEffect(() => {
        if (pathname === '/captain/chat') {
            socket.emit('get-all-rooms-captain');
        }
    }, [pathname]);

    useEffect(() => {
        socket.on("get-all-rooms-captain", ({ rooms }: { rooms: { room: string }[] }) => {
            let roomnos: string[] = [];
            for (const element of rooms) {
                roomnos.push(element.room);
            }
            //setRoomnumbers([...roomnos]);
            setRooms([...roomnos]);
        });

        return () => {
            socket.off('get-all-rooms-captain');
        }
    })

    useEffect(() => {
        socket.on('add-room-captain', ({ roomno }: { roomno: string }) => {
            console.log("first");
            //setRoomnumbers(prev => [...prev, roomno]);
            setRooms([...rooms, roomno]);
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
            {
                rooms.map((roomnumber, index) => (
                    <div
                        key={index}
                        className={cn(buttonVariants({
                            className: 'self-stretch rounded-none mx-1'
                        }), {
                            'bg-white hover:bg-white border-2 border-primary flex': searchParams.get('rno') === roomnumber,
                        })}
                    >
                        <div className='flex-grow'></div>
                        <Link
                            href={{
                                pathname: '/captain/chat',
                                query: {
                                    rno: roomnumber
                                }
                            }}
                            className='w-full h-full flex items-center justify-center'
                        >{roomnumber}</Link>
                        <div className='flex-grow'></div>
                        <Link
                            href={"/captain/chat"}
                            className={cn('hover:bg-black/20 p-1 rounded-full transition-colors', {
                                'hidden': searchParams.get('rno') !== roomnumber,
                            })}
                        >
                            <IoClose />
                        </Link>
                        <button
                            className={cn('hover:bg-red-500 p-1 rounded-md bg-red-400 text-white transition-colors', {
                                'hidden': searchParams.get('rno') === roomnumber,
                            })}
                            onClick={() => {
                                socket.emit('delete-room', { roomno: roomnumber });
                                //setRoomnumbers(prev => prev.filter((room) => room !== roomnumber));
                                setRooms(rooms.filter((room) => room !== roomnumber));
                            }}
                        >
                            <MdDelete />
                        </button>
                    </div>
                ))
            }
        </section>
    )
}
