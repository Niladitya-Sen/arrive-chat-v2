"use client";

import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';
import { Playfair_Display } from 'next/font/google';
import Image from 'next/image';

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
        link: "/captain/services/cab"
    },
    {
        title: "Restaurant & Cafe",
        image: "/services/restaurants.jpg",
        link: "/captain/services/restaurants"
    },
    {
        title: "Laundry Service",
        image: "/services/laundry.jpg",
        link: "/captain/services/laundry"
    },
    {
        title: "Meeting Room",
        image: "/services/meetingroom.png",
        link: "/captain/services/meetingroom"
    },
    {
        title: "Chat with hotel staff",
        image: "/services/call.jpg",
        link: "/captain/services/room"
    },
    {
        title: "Room Service",
        image: "/services/service.jpg",
        link: "/captain/services/service"
    },
    {
        title: "Sightseeing",
        image: "/services/sightseeing.jpg",
        link: "/captain/services/sightseeing"
    },
    {
        title: "Other Services like Spa, Gym, etc.",
        image: "/services/gym.png",
        link: "/captain/services/other"
    },
];

function CaptainServiceCard({ title, image, link }: Readonly<{ title: string, image: string, link: string }>) {
    return (
        <div className='w-full h-full rounded-2xl flex flex-col overflow-hidden relative isolate'>
            <Image
                src={image}
                alt={title}
                loading='lazy'
                priority={false}
                placeholder='empty'
                width={200}
                height={200}
                className='object-cover flex-grow'
            />
            <div className='bg-[#b3a385] p-2 h-full text-center'>
                <p className='text-xs text-white font-semibold uppercase'>{title}</p>
            </div>
            <div className='absolute right-0 bg-red-500 text-white px-2 py-1'>
                1
            </div>
        </div>
    )
}

export default function CaptainServicesSidebar() {
    const isOpen = useServicesSidebarNavigation(state => state.isOpen);
    const toggleSidebar = useServicesSidebarNavigation(state => state.toggle);

    return (
        <section
            className={cn('transition-all duration-300 border-r-2 border-r-primary', {
                'static': isOpen,
                'hidden': !isOpen
            })}
        >
            <div className='m-6'>
                <div className='flex flex-row justify-between items-center w-full mb-4'>
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
                                    pathname: service.link
                                }}
                            >
                                <CaptainServiceCard
                                    {...service}
                                />
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}