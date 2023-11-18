"use client";

import React, { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LanguagesIcon } from 'lucide-react'
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export default function LanguageBtn() {
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('token')) {
            setOpen(true);
        }
    }, [searchParams.get('token')]);

    function handleLanguageChange(value: string) {
        if (value === 'arabic') {
            document.querySelector('html')?.setAttribute('dir', 'rtl');
        } else {
            document.querySelector('html')?.setAttribute('dir', 'ltr');
        }
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
                    <p>Language</p>
                </button>
            </DialogTrigger>
            <DialogContent className={cn("bg-[#2f2f2f] p-10")}>
                <DialogHeader className={cn("flex flex-row items-center justify-center text-xl font-semibold")}>
                    <h1>Please Choose Language</h1>
                </DialogHeader>
                <form action="/chat" className='flex flex-col items-center justify-center gap-4 mt-16'>
                    <Select onValueChange={handleLanguageChange} required name="language">
                        <SelectTrigger className={cn("bg-transparent")}>
                            <SelectValue placeholder="Preferred Language" />
                        </SelectTrigger>
                        <SelectContent className={cn('bg-[#2f2f2f]')}>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="arabic">Arabic</SelectItem>
                            <SelectItem value="russian">Russian</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
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
