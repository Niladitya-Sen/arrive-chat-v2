"use client";

import { cn } from '@/lib/utils'
import { useCaptainRoomSidebar } from '@/store/CaptainRoomSidebar';
import React, { useEffect, useState } from 'react'
import { buttonVariants } from '../ui/button';
import Link from 'next/link';
import socket from '@/socket/socket';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { IoClose } from "react-icons/io5";
import { useRoomStore } from '@/store/CaptainStore';
import { MdDelete } from "react-icons/md";
import { HiChevronDoubleLeft } from 'react-icons/hi2';
import { getDictionary } from '@/app/[lang]/dictionaries';


export default function CaptainRoomsSidebar() {
    const isRoomOpen = useCaptainRoomSidebar(state => state.isOpen);
    const toggleRoomBar = useCaptainRoomSidebar(state => state.toggle);
    //const [roomnumbers, setRoomnumbers] = React.useState<string[]>([]);
    const searchParams = useSearchParams();
    const { rooms, setRooms } = useRoomStore(state => state);
    const pathname = usePathname();
    const params = useParams();
    const [dict, setDict] = useState<{ [key: string]: { [key: string]: string; }; }>({});

    useEffect(() => {
        (async () => {
            const dict = await getDictionary(params.lang as string);
            setDict(dict);
        })();
    }, []);

    useEffect(() => {
        socket.connect();
    }, []);

    useEffect(() => {
        if (pathname === `/${params.lang}/captain/chat`) {
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
            //setRoomnumbers(prev => [...prev, roomno]);
            setRooms([...rooms, roomno]);
        });

        return () => {
            socket.off('add-room-captain');
        }
    });

    return (
        <section className={cn('border-0 border-r-2 border-primary flex-col gap-2 items-center sm:w-full h-full overflow-y-auto scrollbar-none absolute z-[60] sm:relative w-[50%] bg-white sm:bg-transparent', {
            'hidden': !isRoomOpen,
            'flex': isRoomOpen,
            'border-r-0 border-l-2 border-l-primary': params.lang === 'ar',
        })}>
            <div className="w-full flex items-center justify-between sm:justify-center px-2">
                <p className='pb-4 pt-6 text-center'>{dict?.captain?.room_number}</p>
                <button
                    className='text-2xl static sm:hidden'
                    onClick={toggleRoomBar}
                >
                    <HiChevronDoubleLeft />
                </button>
            </div>
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
                                pathname: `/${params.lang}/captain/chat`,
                                query: {
                                    rno: roomnumber
                                }
                            }}
                            className='w-full h-full flex items-center justify-center'
                        >{roomnumber}</Link>
                        <div className='flex-grow'></div>
                        <Link
                            href={`/${params.lang}/captain/chat`}
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
