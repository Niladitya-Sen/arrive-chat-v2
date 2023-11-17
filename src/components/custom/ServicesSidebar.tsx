"use client";

import Link from 'next/link';
import React, { useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HiChevronDoubleLeft } from 'react-icons/hi';
import ServiceCard from './ServiceCard';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';
import { Playfair_Display } from 'next/font/google';
import { } from '@/components/ui/dialog'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useCookies } from '@/hooks/useCookies';

const playfairDisplay = Playfair_Display({
    weight: ['400', '800'],
    style: ['normal', 'italic'],
    subsets: ['latin-ext'],
    display: 'swap',
})

const services = [
    {
        title: "Cab/Taxi Service",
        image: "/services/cab.jpg",
        link: "/services/cab"
    },
    {
        title: "Restaurant & Cafe",
        image: "/services/restaurants.jpg",
        link: "/services/restaurants"
    },
    {
        title: "Laundry Service",
        image: "/services/laundry.jpg",
        link: "/services/laundry"
    },
    {
        title: "Meeting Room",
        image: "/services/meetingroom.png",
        link: "/services/meetingroom"
    },
    {
        title: "Chat with hotel staff",
        image: "/services/call.jpg",
        link: "/services/room"
    },
    {
        title: "Room Service",
        image: "/services/service.jpg",
        link: "/services/service"
    },
    {
        title: "Sightseeing",
        image: "/services/sightseeing.jpg",
        link: "/services/sightseeing"
    },
    {
        title: "Other Services like Spa, Gym, etc.",
        image: "/services/gym.png",
        link: "/services/other"
    }
];

export default function ServicesSidebar() {
    const isOpen = useServicesSidebarNavigation(state => state.isOpen);
    const toggleSidebar = useServicesSidebarNavigation(state => state.toggle);
    const searchParams = useSearchParams();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const cookies = useCookies();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        dialogRef.current?.close();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
        const response = await fetch('https://ae.arrive.waysdatalabs.com/api/customer/add-roomno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookies.getCookie('token'),
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log(result);
        if (result.success) {
            router.push("?roomno=" + data.roomno);
        }
    }

    return (
        <React.Fragment>
            <dialog
                ref={dialogRef}
                className={cn('fixed inset-0 z-50 backdrop-blur-sm rounded-md w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full text-white backdrop:bg-black/80 backdrop:backdrop-blur-md')}
                open={false}
            >
                <form
                    className='flex flex-col'
                    onSubmit={handleSubmit}
                >
                    <h1 className='text-lg font-semibold leading-none tracking-tight mb-5'>Please enter your Room Number</h1>
                    <Input
                        required
                        type="text"
                        name="roomno"
                        placeholder='Room Number'
                        className='w-full p-2 border-2 border-gray-300 rounded-md'
                    />
                    <Button
                        className={cn('text-white mt-2 w-fit self-end')}
                    >Book Now</Button>
                </form>
            </dialog>
            <section
                className={cn('flex-col sm:items-center p-6 gap-6 transition-all duration-300 border-r-2 border-r-primary', {
                    'flex': isOpen,
                    'hidden': !isOpen
                })}
            >
                <div className='flex flex-row justify-between items-center w-full'>
                    <h1 className={playfairDisplay.className}>Welcome to Arrive Chat</h1>
                    <button
                        className='text-2xl self-end'
                        onClick={toggleSidebar}
                    >
                        <HiChevronDoubleLeft />
                    </button>
                </div>
                <div
                    className='grid grid-cols-[repeat(2,minmax(100px,1fr))] gap-4 w-full'
                >
                    {
                        services.map((service, index) => (
                            <Link
                                key={index}
                                href={{
                                    pathname: service.link,
                                    query: {
                                        roomno: searchParams.get("roomno")
                                    },
                                }}
                            >
                                <ServiceCard
                                    {...service}
                                    dialogRef={dialogRef}
                                />
                            </Link>
                        ))
                    }
                </div>
            </section>
        </React.Fragment>
    )
}