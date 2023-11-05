import ServicesSidebar from '@/components/custom/ServicesSidebar'
import { Separator } from '@/components/ui/separator'
import React from 'react'

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <section
            className='grid grid-cols-[300px_2px_1fr]'
        >
            <ServicesSidebar />
            <Separator orientation='vertical' className='w-[2px] bg-primary' />
            {children}
        </section>
    )
}
