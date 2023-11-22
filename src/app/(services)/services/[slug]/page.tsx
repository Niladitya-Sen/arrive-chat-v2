import React from 'react'
import ChatLayout from '@/components/custom/ChatLayout'

export default function Service({ params }: Readonly<{ params: { slug: string } }>) {
    return (
        <ChatLayout firstMessage={{
            message: `Do you want to book ${params.slug} service?`,
            role: 'captain',
            time: new Date().toLocaleTimeString(
                'en-US',
                { hour: 'numeric', minute: 'numeric', hour12: true },
            ),
            type: "choice"
        }} isCaptainConnected />
    )
}
