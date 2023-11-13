"use client"

import React from 'react'
import { HiChevronDoubleLeft } from 'react-icons/hi'
import { cn } from '@/lib/utils'
import { Cookie, Playfair_Display } from 'next/font/google'
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const playfairDisplay = Playfair_Display({
    weight: ['400', '800'],
    style: ['normal', 'italic'],
    subsets: ['latin-ext'],
    display: 'swap',
})

export default function CaptainProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const toggleSidebar = useServicesSidebarNavigation(state => state.toggle);
    const isOpen = useServicesSidebarNavigation(state => state.isOpen);
    const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

    return (
        <React.Fragment>
            <section className={cn('flex flex-col p-4 border-0 border-r-2 border-primary', {
                'flex': isOpen,
                'hidden': !isOpen
            })}>
                <div className='flex flex-row justify-between items-center w-full mb-4'>
                    <h1 className={`${playfairDisplay.className} text-xl`}>Profile</h1>
                    <button
                        className='text-2xl self-end'
                        onClick={toggleSidebar}
                    >
                        <HiChevronDoubleLeft />
                    </button>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className='rounded-none'>Sign Out</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <p className={`${playfairDisplay.className} text-xl text-center mb-4`}>Are you sure you want to Sign Out?</p>
                        </DialogHeader>
                        <DialogFooter className={cn('sm:justify-center')}>
                            <div className='flex flex-col gap-2'>
                                <Button type="button" variant="secondary" size="lg" className={cn('rounded-none border-2 border-primary uppercase')}
                                    onClick={() => {
                                        localStorage.removeItem('ac_ut');
                                        document.cookie = "language=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                        window.location.href = "/captain";
                                    }}
                                >
                                    Yes, Sure
                                </Button>
                                <Button type="button" variant="ghost" size="sm" className={cn('rounded-none')}
                                    onClick={() => {
                                        dialogCloseRef.current?.click();
                                    }}
                                >
                                    Not now
                                </Button>
                            </div>
                            <DialogClose ref={dialogCloseRef} className="hidden"></DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </section>
            {children}
        </React.Fragment>
    )
}
