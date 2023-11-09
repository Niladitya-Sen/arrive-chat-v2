import Navbar from '@/components/custom/Navbar'
import React from 'react'
import { Playfair_Display } from 'next/font/google'
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import EllipseButton from '@/components/custom/EllipseButton';
import { BsStar } from 'react-icons/bs';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const playfairDisplay = Playfair_Display({
    weight: ['400', '800'],
    style: ['normal', 'italic'],
    subsets: ['latin-ext'],
    display: 'swap',
})

export default async function Home() {
    return (
        <main className='bg-[url("/cover.jpg")] bg-cover bg-top bg-no-repeat'>
            <section className='bg-[#120f09] bg-opacity-90 flex flex-col p-4 pb-0 min-h-screen'>
                <Navbar />
                <section
                    className='flex flex-col items-center justify-center w-full mt-8 max-w-3xl mx-auto px-2'
                >
                    <h1 className={`${playfairDisplay.className} text-7xl`}>Zest up your chats</h1>
                    <h1 className={`${playfairDisplay.className} text-7xl`}>each and every day!</h1>
                    <h2 className={`${playfairDisplay.className} text-xl mt-8`}>Get ready to be blown away by the revolutionary AI chatbot service of Arrive Chat!</h2>
                    <h2 className={`${playfairDisplay.className} text-xl mt-1`}>Are you geared up for the ride?</h2>
                    <Input
                        type='email'
                        placeholder='Enter your email address'
                        className={cn('bg-transparent rounded-none border-primary placeholder:text-primary w-[20rem] py-5 mt-[55px]')}
                    />
                    <button className='mt-8'>
                        <EllipseButton />
                    </button>
                </section>
                <div className='flex-grow'></div>
                <section className='hidden md:flex flex-row w-full justify-between items-end relative isolate'>
                    <div className='flex flex-row gap-6 items-center justify-center border-[1px] border-primary p-2'>
                        <BsStar className='text-primary' />
                        New Update Available
                    </div>
                    <div className='w-[32rem] h-[166px] bg-[#9b9b9a] absolute bottom-0 right-0 flex flex-row'>
                        <Image
                            src="/bottomCard.jpg"
                            width={166}
                            height={245}
                            alt='bottom card'
                            className='object-cover'
                        />
                        <div>
                            <article className='p-5 pb-2'>
                                <p className={`${playfairDisplay.className} font-bold text-black mb-2`}>Explore the best AI personal assistant</p>
                                <p>We understand that every learner is unique.</p>
                            </article>
                            <Button className={cn('text-white rounded-none ml-5')}>Explore Now</Button>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    )
}
