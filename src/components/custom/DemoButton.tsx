"use client";

import React from 'react'
import { Button } from '../ui/button'
import { useCookies } from '@/hooks/useCookies';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function DemoButton() {
    const cookies = useCookies();
    const router = useRouter();

    function handleClick() {
        cookies.deleteCookie('token');
        cookies.deleteCookie('roomno');
        cookies.deleteCookie('language');
        const demoToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRpZG9kMjk2ODdAaHVwb2kuY29tIiwiZXhwIjoxOTIyNzQ1NjAwfQ.84zA_z1jxKb-2THoDdXNqc0w6OCRFSD1EZHbJ5stHvc";
        const demoRoomno = "5656";
        cookies.setCookie('token', demoToken, 365, "/");
        cookies.setCookie('roomno', demoRoomno, 365, "/");
        cookies.setCookie('language', 'en', 365, "/");
        localStorage.removeItem('ac_ut');
        router.push('/en/chat');
    }

    return (
        <Button
            className={cn('absolute top-4 right-4 text-white text-center flex flex-col py-7')}
            onClick={handleClick}
        >
            <p>Demo Now!</p>
            <p>Aloft Palm Jumeirah</p>
        </Button>
    )
}
