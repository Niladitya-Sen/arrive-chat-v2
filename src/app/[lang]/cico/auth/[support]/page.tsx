"use client";

import { getDictionary } from '@/app/[lang]/dictionaries';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCookies } from '@/hooks/useCookies';
import socket from '@/socket/socket';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ImSpinner8 } from "react-icons/im";

export default function Auth({ params: { lang, support } }: Readonly<{ params: { lang: string, support: string } }>) {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const cookies = useCookies();
    const router = useRouter();
    const [dict, setDict] = useState<{ [key: string]: { [key: string]: string; }; }>({});

    useEffect(() => {
        (async () => {
            const dict = await getDictionary(lang);
            setDict(dict);
        })();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const response = await fetch('https://ae.arrive.waysdatalabs.com/node-api/customer/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                support
            })
        });
        const result = await response.json();
        setLoading(false);
        if (result.success) {
            socket.emit('add-support-user', { sessionId: result.sessionId });
            cookies.setCookie('cico_token', result.token, 1, '/');
            cookies.setCookie('supportType', support, 1, '/');
            cookies.setCookie('cico_sessionId', result.sessionId, 1, '/');
            router.push(`/${lang}/cico/chat`);
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive"
            });
        }
    }

    return (
        <main className='relative isolate bg-background h-screen flex flex-col items-center justify-center p-1'>
            {loading && <div className='absolute inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center cursor-wait'>
                <ImSpinner8 className='animate-spin text-4xl text-white' />
            </div>}
            <form
                className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col w-full m-auto"
                onSubmit={handleSubmit}
            >
                <h2 className="text-gray-900 text-lg font-medium title-font mb-5">{dict?.chatPage?.confirmIdentity}</h2>
                <div className="relative mb-4">
                    <label htmlFor="name" className="leading-7 text-sm text-gray-600">{dict?.chatPage?.fullName}</label>
                    <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-[#948770] focus:ring-2 focus:ring-[#948770]/80 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required />
                </div>
                <div className="relative mb-4">
                    <label htmlFor="email" className="leading-7 text-sm text-gray-600">{dict?.chatPage?.registeredEmail}</label>
                    <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-[#948770] focus:ring-2 focus:ring-[#948770]/80 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required />
                </div>
                {
                    support === 'check-out' && (
                        <div className="relative mb-4">
                            <label htmlFor="roomno" className="leading-7 text-sm text-gray-600">{dict?.chatPage?.roomNumber}</label>
                            <input type="text" id="roomno" name="roomno" className="w-full bg-white rounded border border-gray-300 focus:border-[#948770] focus:ring-2 focus:ring-[#948770]/80 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required />
                        </div>
                    )
                }
                <Button>{dict?.captain?.submit}</Button>
            </form>
        </main >
    )
}
