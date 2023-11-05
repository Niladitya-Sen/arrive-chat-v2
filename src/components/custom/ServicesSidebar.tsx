"use client";

import Link from 'next/link';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HiChevronDoubleLeft } from 'react-icons/hi';
import ServiceCard from './ServiceCard';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';

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

    return (
        <section
            className={cn('flex-col sm:items-center p-6 gap-6 transition-all duration-300 border-r-2 border-r-primary', {
                'flex': isOpen,
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
                            />
                        </Link>
                    ))
                }
            </div>
        </section>
    )
}