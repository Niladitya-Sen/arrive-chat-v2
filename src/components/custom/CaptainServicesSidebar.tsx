"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { HiChevronDoubleLeft } from 'react-icons/hi';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';
import { Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import { useServicesStore } from '@/store/CaptainStore';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { useParams } from 'next/navigation';
import { HiChevronDoubleRight } from 'react-icons/hi2';

const playfairDisplay = Playfair_Display({
    weight: ['400', '800'],
    style: ['normal', 'italic'],
    subsets: ['latin-ext'],
    display: 'swap',
});

function CaptainServiceCard({ title, image, link }: Readonly<{ title: string, image: string, link: string }>) {
    return (
        <div className='w-full h-full rounded-2xl flex flex-col overflow-hidden relative isolate'>
            <Image
                src={image}
                alt={"service"}
                width={200}
                height={200}
                className='object-cover flex-grow w-full'
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
    const services = useServicesStore(state => state.services);
    const params = useParams();
    const [dict, setDict] = useState<{ [key: string]: { [key: string]: string; }; }>({});

    useEffect(() => {
        (async () => {
            const dict = await getDictionary(params.lang as string);
            setDict(dict);
        })();
    }, []);

    return (
        <section
            className={cn('transition-all duration-300 border-r-2 border-r-primary', {
                'static': isOpen,
                'hidden': !isOpen,
                'border-r-0 border-l-2 border-l-primary': params.lang === 'ar',
            })}
        >
            <div className='m-6'>
                <div className='flex flex-row justify-between items-center w-full mb-4'>
                    <h1 className={playfairDisplay.className}>{dict?.chatPage?.servicesH1}</h1>
                    <button
                        className='text-2xl self-end'
                        onClick={toggleSidebar}
                    >
                        {
                            params.lang === 'ar' ? (
                                <HiChevronDoubleRight />
                            ) : (
                                <HiChevronDoubleLeft />
                            )
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
                                    pathname: `/${params.lang}/captain` + service?.link
                                }}
                                onClick={() => {
                                    if (window.innerWidth < 768) {
                                        toggleSidebar();
                                    }
                                }}
                            >
                                <CaptainServiceCard
                                    image={service.image}
                                    title={dict?.services?.[service.title]}
                                    link={service.link}
                                />
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}