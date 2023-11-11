"use client";

import { cn } from '@/lib/utils'
import { useCaptainRoomSidebar } from '@/store/CaptainRoomSidebar';
import React from 'react'
import { Button, buttonVariants } from '../ui/button';
import Link from 'next/link';

const roomnumbers = [5518, 5519, 5520, 5521, 5522, 5523, 5524, 5525, 5526, 5527, 5528, 5529, 5530, 5531, 5532, 5533, 5534, 5535, 5536, 5537, 5538, 5539, 5540, 5541, 5542, 5543, 5544, 5545, 5546, 5547, 5548, 5549, 5550, 5551, 5552, 5553, 5554, 5555, 5556, 5557, 5558, 5559, 5560, 5561, 5562, 5563, 5564, 5565, 5566, 5567, 5568, 5569, 5570, 5571, 5572, 5573, 5574, 5575, 5576, 5577, 5578, 5579, 5580, 5581, 5582, 5583, 5584, 5585, 5586, 5587, 5588, 5589, 5590, 5591, 5592, 5593, 5594, 5595, 5596, 5597, 5598, 5599, 5600, 5601, 5602, 5603, 5604, 5605, 5606, 5607, 5608, 5609, 5610, 5611, 5612, 5613, 5614, 5615, 5616, 5617, 5618, 5619, 5620, 5621, 5622, 5623, 5624, 5625, 5626, 5627, 5628, 5629, 5630, 5631, 5632, 5633, 5634, 5635, 5636, 5637, 5638, 5639, 5640, 5641, 5642, 5643, 5644, 5645, 5646, 5647, 5648, 5649, 5650, 5651, 5652, 5653, 5654, 5655];

export default function CaptainRoomsSidebar() {
    const isRoomOpen = useCaptainRoomSidebar(state => state.isOpen);
    return (
        <section className={cn('border-0 border-r-2 border-primary flex-col gap-2 items-center w-full h-full overflow-y-auto scrollbar-none', {
            'hidden': !isRoomOpen,
            'flex': isRoomOpen
        })}>
            <p className='pb-4 pt-6 text-center'>Room Numbers</p>
            {roomnumbers.map((roomnumber, index) => (
                <Link
                    href={{
                        pathname: '/captain/chat',
                        query: {
                            rno: roomnumber
                        }
                    }}
                    key={index}
                    className={cn(buttonVariants({
                        className: 'self-stretch rounded-none mx-1'
                    }))}
                >{roomnumber}</Link>
            ))}
        </section>
    )
}
