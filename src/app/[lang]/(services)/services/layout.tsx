"use client";

import ServicesSidebar from '@/components/custom/ServicesSidebar';
import { cn } from '@/lib/utils';
import { useServicesSidebarNavigation } from '@/store/ServicesSidebarNavigation';
import React from 'react';

export default function ServicesLayout({ children, params: { lang } }: Readonly<{ children: React.ReactNode, params: { lang: string } }>) {
    const isOpen = useServicesSidebarNavigation(state => state.isOpen);

    return (
        <section
            className={cn('grid grid-cols-1 transition-all duration-300', {
                'sm:grid-cols-[300px_1fr]': isOpen,
                'grid-cols-1': !isOpen,
            })}
        >
            <ServicesSidebar lang={lang} />
            <div
                className={cn('hidden sm:flex', {
                    'hidden': isOpen,
                    'flex': !isOpen,
                })}
            >
                {children}
            </div>
        </section>
    )
}
