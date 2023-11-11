import ChatHeader from '@/components/custom/ChatHeader'
import Sidebar, { SidebarToggleButton } from '@/components/custom/Sidebar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import React from 'react'

export default function ChatLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <section className='flex flex-col h-screen'>
            <ChatHeader />
            <div className='grid grid-rows-[6rem_1fr] sm:grid-cols-[8rem_2px_1fr] sm:grid-rows-[100%] h-full text-black relative isolate bg-gradient-to-r from-[#eadec7] via-[#fcf8f0] to-[#eadec7]'>
                <SidebarToggleButton />
                <Sidebar />
                <Separator orientation='vertical' className={cn("w-[1.5px] bg-primary hidden sm:block")} />
                {children}
            </div>
        </section>
    )
}
