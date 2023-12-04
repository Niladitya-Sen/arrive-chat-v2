"use client";

import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '../ui/button'
import { BsPerson } from 'react-icons/bs'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialog'
import Image from 'next/image'
import { Input } from '../ui/input'
import { Playfair_Display } from 'next/font/google'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCookies } from '@/hooks/useCookies';

const playfairDisplay = Playfair_Display({
    weight: ['400'],
    style: ['normal'],
    subsets: ['latin-ext'],
    display: 'swap',
});

export default function CaptainNavbar({ dict }: Readonly<{ dict: { [key: string]: { [key: string]: string } } }>) {
    const router = useRouter();
    const cookies = useCookies();
    const { login, name, preferred, employee, password, email, dialogH1 } = dict.captain;
    const params = useParams();
    const [lang, setLang] = useState(params.lang as string);
    const [dialogOpen, setDialogOpen] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('open') === 'dialog') {
            setDialogOpen(true);
        }
    }, [searchParams.get('open')]);

    useEffect(() => {
        if (!dialogOpen) {
            router.push("/captain");
        }
    }, [dialogOpen]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())
        const response = await fetch('https://ae.arrive.waysdatalabs.com/api/captain/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
            cookies.setCookie('ac_token', result.token, 365, '/');
            localStorage.setItem('ac_ut', 'captain');
            router.push(`/${lang}/captain/chat`);
        }
    }

    return (
        <header>
            <nav className='text-white flex items-center justify-around'>
                <div className='w-[180px] invisible'></div>
                <div className='flex flex-col items-center justify-center'>
                    <Image
                        src="/img/arrivechat.png"
                        alt="Arrive Chat"
                        width={202}
                        height={74}
                        priority
                        className='w-[156px] h-[57px]'
                    />
                    <p className='text-2xl'>وصول الدردشة</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <div
                            className={buttonVariants({
                                variant: 'default',
                                className: cn('cursor-pointer flex flex-row items-center justify-between gap-2 uppercase px-5 py-6 text-white')
                            })}
                        >
                            <BsPerson className='text-xl' />
                            <p>{login}</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent className={cn("bg-[#2f2f2f] p-10")}>
                        <DialogHeader className={cn("flex flex-row items-center justify-center text-xl font-semibold")}>
                            <h1 className={`${playfairDisplay.className} text-2xl`}>{dialogH1}</h1>
                        </DialogHeader>
                        <form
                            className='flex flex-col gap-4 mt-8'
                            onSubmit={handleSubmit}
                        >
                            <Input
                                type='text'
                                name='name'
                                required
                                className={cn('bg-transparent border-0 border-b-2 border-white rounded-none pl-0 placeholder:text-white placeholder:uppercase')}
                                placeholder={name}
                            />
                            <Input
                                type='text'
                                name='employee_id'
                                required
                                className={cn('bg-transparent border-0 border-b-2 border-white rounded-none pl-0 placeholder:text-white placeholder:uppercase')}
                                placeholder={employee}
                            />
                            <Input
                                type='email'
                                name='email'
                                required
                                className={cn('bg-transparent border-0 border-b-2 border-white rounded-none pl-0 placeholder:text-white placeholder:uppercase')}
                                placeholder={email}
                            />
                            <Select
                                value={lang}
                                onValueChange={setLang}
                                dir={params.lang === "ar" ? "rtl" : "ltr"}
                                required
                                name="language"
                            >
                                <SelectTrigger className={cn('bg-transparent border-0 border-b-2 border-white rounded-none pl-0 placeholder:text-white placeholder:uppercase uppercase')}>
                                    <SelectValue placeholder={preferred} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem className='uppercase' value="en">English</SelectItem>
                                    <SelectItem className='uppercase' value="ar">Arabic</SelectItem>
                                    <SelectItem className='uppercase' value="ru">Russian</SelectItem>
                                    <SelectItem className='uppercase' value="fr">French</SelectItem>
                                    <SelectItem className='uppercase' value="de">German</SelectItem>
                                    <SelectItem className='uppercase' value="es">Spanish</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type='password'
                                name='password'
                                required
                                className={cn('bg-transparent border-0 border-b-2 border-white rounded-none pl-0 placeholder:text-white placeholder:uppercase')}
                                placeholder={password}
                                autoComplete='off'
                            />
                            <Button
                                size={'lg'}
                                className={cn('mt-8 self-center bg-[#1c1c1c] text-white uppercase rounded-none px-14 py-6 border-2 border-[#615641] hover:bg-[#615641]')}
                            >{login}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </nav>
        </header>
    )
}
