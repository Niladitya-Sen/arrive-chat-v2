import React from 'react';
import ChatLayout from '@/components/custom/ChatLayout';
import ChatHeader from '@/components/custom/ChatHeader';

export default function CICOChat() {
    return (
        <main className='text-black bg-gradient-to-r from-[#eadec7] via-[#fcf8f0] to-[#eadec7]'>
            <ChatHeader />
            <ChatLayout isCICO isCaptainConnected />
        </main>
    )
}
