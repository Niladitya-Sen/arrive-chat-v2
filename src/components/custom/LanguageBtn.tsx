"use client";

import React, { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LanguagesIcon } from 'lucide-react'
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCookies } from '@/hooks/useCookies';

export default function LanguageBtn({ title }: Readonly<{ title: string }>) {
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState('en');
    const router = useRouter();
    const cookies = useCookies();

    useEffect(() => {
        if (searchParams.get('token') || searchParams.get('open') === 'dialog') {
            setOpen(true);
        }
    }, [searchParams.get('token'), searchParams.get('open')]);

    function handleLanguageChange(value: string) {
        setLanguage(value);
        if (value === 'ar') {
            document.querySelector('html')?.setAttribute('dir', 'rtl');
        } else {
            document.querySelector('html')?.setAttribute('dir', 'ltr');
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        cookies.setCookie('language', language, 365, '/');
        router.push(`/${language}/chat`);

        if (searchParams.get('token') === null) {
            return;
        }

        const response = await fetch('https://ae.arrive.waysdatalabs.com/api/language', {
            method: 'POST',
            body: JSON.stringify({
                language: language,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${searchParams.get('token')}`,
            }
        });
        const result = await response.json();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className={buttonVariants({
                        variant: 'default',
                        className: cn('cursor-pointer flex flex-row items-center justify-between gap-2 uppercase px-5 py-6 text-white mt-8 bg-transparent border-2 border-primary hover:bg-primary rounded-none')
                    })}
                >
                    <LanguagesIcon className='text-xl' />
                    <p>{title}</p>
                </button>
            </DialogTrigger>
            <DialogContent className={cn("bg-[#2f2f2f] p-10")}>
                <DialogHeader className={cn("flex flex-row items-center justify-center text-xl font-semibold")}>
                    <h1>Please Choose Language</h1>
                </DialogHeader>
                <form className='flex flex-col items-center justify-center gap-4 mt-16' onSubmit={handleSubmit}>
                    <Select value={language} onValueChange={handleLanguageChange} required name="language">
                        <SelectTrigger className={cn("bg-transparent")}>
                            <SelectValue placeholder="Preferred Language" />
                        </SelectTrigger>
                        <SelectContent className={cn('bg-[#2f2f2f]')}>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                            <SelectItem value="ru">Russian</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        size={'lg'}
                        className={cn('mt-8 bg-[#1c1c1c] text-white uppercase rounded-none px-14 py-6 border-2 border-[#615641] hover:bg-[#615641]')}
                    >Start</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
