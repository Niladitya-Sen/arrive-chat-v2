"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import ServiceCard from './ServiceCard';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';
import { Playfair_Display } from 'next/font/google';
import { services } from '@/lib/services';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { HiChevronDoubleRight, HiChevronDoubleLeft } from 'react-icons/hi2';

const playfairDisplay = Playfair_Display({
    weight: ['400', '800'],
    style: ['normal', 'italic'],
    subsets: ['latin-ext'],
    display: 'swap',
});

export default function ServicesSidebar({ lang }: Readonly<{ lang: string }>) {
    const isOpen = useServicesSidebarNavigation(state => state.isOpen);
    const toggleSidebar = useServicesSidebarNavigation(state => state.toggle);
    const searchParams = useSearchParams();
    const [dict, setDict] = useState<{ [key: string]: { [key: string]: string; }; }>({});

    useEffect(() => {
        (async () => {
            const dict = await getDictionary(lang);
            setDict(dict);
        })();
    }, []);

    return (
        <section
            className={cn('flex-col sm:items-center p-6 gap-6 transition-all duration-300 border-r-2 border-primary', {
                'flex': isOpen,
                'hidden': !isOpen,
                'border-r-0 border-l-2': lang === 'ar',
            })}
        >
            <div className='flex flex-row justify-between items-center w-full'>
                <h1 className={playfairDisplay.className}>{dict?.chatPage?.servicesH1}</h1>
                <button
                    className='text-2xl self-end'
                    onClick={toggleSidebar}
                >
                    {
                        lang === 'ar' ? <HiChevronDoubleRight /> : <HiChevronDoubleLeft />
                    }
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
                                pathname: `/${lang}${service.link}`,
                                query: {
                                    roomno: searchParams.get("roomno")
                                },
                            }}
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    toggleSidebar();
                                }
                            }}
                        >
                            <ServiceCard
                                image={service.image}
                                title={dict?.services?.[service.title]}
                            />
                        </Link>
                    ))
                }
            </div>
        </section>
    )
}