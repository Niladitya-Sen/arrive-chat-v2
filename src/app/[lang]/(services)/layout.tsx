import ChatHeader from '@/components/custom/ChatHeader'
import Sidebar, { SidebarToggleButton } from '@/components/custom/Sidebar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import React from 'react'
import { getDictionary } from '../dictionaries'

export default async function ChatLayout({ children, params: { lang } }: Readonly<{ children: React.ReactNode, params: { lang: string } }>) {
    const dict = await getDictionary(lang);
    return (
        <section className='flex flex-col h-screen'>
            <ChatHeader />
            <div className='grid grid-rows-[6rem_1fr] sm:grid-cols-[8rem_2px_1fr] sm:grid-rows-[100%] flex-1 text-black relative isolate bg-gradient-to-r from-[#eadec7] via-[#fcf8f0] to-[#eadec7]'>
                <SidebarToggleButton />
                <Sidebar dict={dict} lang={lang} />
                <Separator orientation='vertical' className={cn("w-[1.5px] bg-primary hidden sm:block")} />
                {children}
            </div>
        </section>
    )
}
