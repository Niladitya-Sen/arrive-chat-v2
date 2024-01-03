"use client";

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCookies } from '@/hooks/useCookies';

export default function Navbar() {
    const cookies = useCookies();

    React.useEffect(() => {
        async function verifyToken(token: string) {
            try {
                const response = await fetch(`https://ae.arrive.waysdatalabs.com/api/auth/verify-token?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const data = await response.json();
                
                if (!data.success) {
                    cookies.deleteCookie('token');
                    cookies.deleteCookie('roomno');
                    cookies.deleteCookie('sessionId');
                }
                
            } catch (err) {
                console.log(err);
            }
        }
        verifyToken(cookies.getCookie('token') as string);
    })

    return (
        <header>
            <nav className='text-white flex items-center justify-center'>
                <Link href="/" className='flex flex-col items-center justify-center'>
                    <Image
                        src="/img/arrivechat.png"
                        alt="Arrive Chat"
                        width={202}
                        height={74}
                        priority
                        className='w-[156px] h-[57px]'
                    />
                    <p className='text-2xl'>وصول الدردشة</p>
                </Link>
            </nav>
        </header>
    )
}
