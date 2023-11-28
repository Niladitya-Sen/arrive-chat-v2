import React from 'react';
import ChatLayout from '@/components/custom/ChatLayout';
import { getDictionary } from '../../dictionaries';

export default async function Chat({ params: { lang } }: Readonly<{ params: { lang: string } }>) {
    const dict = await getDictionary(lang);

    return (
        <ChatLayout isBot dict={dict} />
    )
}
