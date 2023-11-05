import Navbar from '@/components/custom/Navbar'
import Link from 'next/link';
import React from 'react'

async function getHello() {
    const response = await fetch("https://ae.arrive.waysdatalabs.com/api");
    const data = await response.json();
    return data;
}

export default async function Home() {
    const hello = await getHello();

    return (
        <main className='p-4 flex flex-col bg-[#120f09] min-h-screen'>
            <Navbar />
            <section
                className='flex flex-col items-center justify-center w-full flex-1'
            >
                <p className='text-white text-xl'>{hello.message} coming from api call</p>
                <Link
                    target='_blank'
                    href='https://ae.arrive.waysdatalabs.com/api'
                    className='text-white hover:underline focus:underline'
                >
                    https://ae.arrive.waysdatalabs.com/api
                </Link>
            </section>
        </main>
    )
}
