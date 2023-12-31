import React from 'react';
import ChatLayout from '@/components/custom/ChatLayout';

export default function SOSChat({ params: { roomno } }: { params: { roomno: string } }) {
    return (
        <ChatLayout />
    )
}
