import CaptainRoomsSidebar from '@/components/custom/CaptainRoomsSidebar';
import CaptainServicesSidebar from '@/components/custom/CaptainServicesSidebar';
import React from 'react'

export default function CaptainChatLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <React.Fragment>
            <CaptainServicesSidebar />
            <CaptainRoomsSidebar />
            {children}
        </React.Fragment>
    )
}
