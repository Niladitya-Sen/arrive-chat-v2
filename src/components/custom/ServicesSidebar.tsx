"use client";

import Link from 'next/link';
import React from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { HiMenuAlt2 } from 'react-icons/hi';
import ServiceCard from './ServiceCard';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';

const services = [
    {
        title: "Cab/Taxi Service",
        image: "/services/cab.jpg"
    },
    {
        title: "Restaurant & Cafe",
        image: "/services/restaurants.jpg"
    },
    {
        title: "Laundry Service",
        image: "/services/laundry.jpg"
    },
    {
        title: "Meeting Room",
        image: "/services/meetingroom.png"
    },
    {
        title: "Chat with hotel staff",
        image: "/services/call.jpg"
    },
    {
        title: "Room Service",
        image: "/services/service.jpg"
    },
    {
        title: "Sightseeing",
        image: "/services/sightseeing.jpg"
    },
    {
        title: "Other Services like Spa, Gym, etc.",
        image: "/services/gym.png"
    }
];

export default function ServicesSidebar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isOpen = useServicesSidebarNavigation(state => state.isOpen);
    const toggleSidebar = useServicesSidebarNavigation(state => state.toggle);

    return (
        <section
            className={cn('sm:static sm:w-auto sm:bg-transparent sm:shadow-none sm:flex flex-col sm:items-center p-6 gap-6 transition-all duration-300', {
                'absolute z-50 bg-white h-full w-[300px] shadow-lg flex items-start': isOpen,
                'hidden': !isOpen
            })}
        >
            <div className='flex flex-row justify-between items-center w-full'>
                <h1>Welcome to Arrive Chat</h1>
                <button
                    className='text-2xl self-end'
                    onClick={toggleSidebar}
                >
                    <HiChevronDoubleLeft />
                </button>
            </div>
            <div
                className='grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 w-full'
            >
                {
                    services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            {...service}
                        />
                    ))
                }
            </div>
        </section>
    )
}