"use client"

import CaptainSidebar, { CaptainSidebarToggleButton } from '@/components/custom/CaptainSidebar'
import ChatHeader from '@/components/custom/ChatHeader'
import { cn } from '@/lib/utils'
import React from 'react'
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation'
import { useCaptainRoomSidebar } from '@/store/CaptainRoomSidebar'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { useAlertStore } from '@/store/AlertStore'


export default function CaptainLayout({ children, params: { lang } }: Readonly<{ children: React.ReactNode, params: { lang: string } }>) {
    const isOpen = useServicesSidebarNavigation(state => state.isOpen);
    const isRoomOpen = useCaptainRoomSidebar(state => state.isOpen);
    const pathname = usePathname();
    const { isAlertOpen, type, message } = useAlertStore(state => state);

    let icon;
    if (type === 'success') {
        icon = <CheckCircle className='text-white w-6 h-6' color='green' />;
    } else if (type === 'details') {
        icon = <Loader2 className='text-white w-6 h-6 animate-spin' color='blue' />;
    } else {
        icon = <AlertCircle className='text-white w-6 h-6' color='red' />;
    }

    return (
        <section className='flex flex-col h-screen relative isolate'>
            <Alert className={cn('absolute top-5 left-5 w-fit bg-green-500 border-0 shadow-md transition-all -translate-x-96 opacity-0', {
                "translate-x-0 opacity-100": isAlertOpen,
                "bg-red-500": type === 'error',
                "bg-blue-500": type === 'details',
            })}>
                {icon}
                <AlertTitle className={cn("text-green-800", {
                    "text-red-800": type === 'error',
                    "text-blue-800": type === "details",
                })}>{type.charAt(0).toUpperCase() + type.substring(1)}</AlertTitle>
                <AlertDescription className={cn("text-green-900", {
                    "text-red-900": type === 'error',
                    "text-blue-900": type === "details",
                })}>
                    {message}
                </AlertDescription>
            </Alert>

            {
                pathname === `/${lang}/captain` ? (
                    <>
                        {children}
                    </>
                ) : (
                    <>
                        <ChatHeader />
                        <div className={cn('grid grid-rows-[6rem_1fr] h-full sm:grid-cols-[8rem_2px_1fr] sm:grid-rows-[100%] text-black relative isolate bg-gradient-to-r from-[#eadec7] via-[#fcf8f0] to-[#eadec7]', {
                            'sm:grid-cols-[8rem_2px_1fr]': !isOpen,
                            'sm:grid-cols-[8rem_2px_160px_1fr]': !isOpen && isRoomOpen && pathname !== `/${lang}/captain/profile`,
                            'sm:grid-cols-[8rem_2px_300px_1fr]': isOpen,
                            'sm:grid-cols-[8rem_2px_300px_160px_1fr]': isRoomOpen && isOpen && pathname !== `/${lang}/captain/profile`,
                        })}>
                            <CaptainSidebarToggleButton />
                            <CaptainSidebar />
                            <Separator orientation='vertical' className={cn("w-[1.5px] bg-primary hidden sm:block")} />
                            {children}
                        </div>
                    </>
                )
            }
        </section>
    )
}
