import React from 'react'
import ChatLayout from '@/components/custom/ChatLayout'
import { getDictionary } from '@/app/[lang]/dictionaries'

export default async function Service({ params }: Readonly<{ params: { slug: string, lang: string } }>) {
    const dict = await getDictionary(params.lang);
    const { bookThisService } = dict.chatPage;
    return (
        <ChatLayout isCaptainConnected />
    )
}
