"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeXmark } from "react-icons/fa6";
import useVoiceStore from '@/store/VoiceStore';

export default function Voice() {
    const pathname = usePathname();
    const voice = useVoiceStore(state => state);

    return (
        <button
            className={cn('absolute top-4 right-4 bg-primary/40 rounded-full text-lg p-4 hover:bg-primary/70 transition-colors', {
                'hidden': pathname.includes('captain') || pathname.includes('services')
            })}
            onClick={() => useVoiceStore.setState({ state: !voice.state })}
        >
            {
                voice.state ? <FaVolumeUp /> : <FaVolumeXmark />
            }
        </button>
    )
}
