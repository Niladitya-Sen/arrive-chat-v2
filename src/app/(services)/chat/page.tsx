"use client";

import React from 'react';
import ChatLayout from '@/components/custom/ChatLayout';

export default function Chat({ searchParams }: Readonly<{ searchParams: { [key: string]: string | string[] } }>) {
    const { language } = searchParams;

    return (
        <ChatLayout />
    )
}
