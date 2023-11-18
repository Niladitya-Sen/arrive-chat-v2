"use client";

import React, { useEffect } from 'react';
import { useCookies } from '@/hooks/useCookies';

export default function CheckDir() {
    const cookies = useCookies();
    
    useEffect(() => {
        const language = cookies.getCookie('language');
        if (language === 'arabic') {
            document.querySelector('html')?.setAttribute('dir', 'rtl');
        } else {
            document.querySelector('html')?.setAttribute('dir', 'ltr');
        }
    }, []);

    return (
        <></>
    )
}
