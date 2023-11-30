import React from 'react';
import { Playfair_Display } from 'next/font/google';
import { cn } from '@/lib/utils';
import EllipseButton from '@/components/custom/EllipseButton';
import { BsStar } from 'react-icons/bs';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CaptainNavbar from '@/components/custom/CaptainNavbar';
import { getDictionary } from '../dictionaries';

const playfairDisplay = Playfair_Display({
    weight: ['400', '800'],
    style: ['normal', 'italic'],
    subsets: ['latin-ext'],
    display: 'swap',
});

export default async function CaptainHome({ params: { lang } }: { params: { lang: string } }) {
    const dict = await getDictionary(lang);

    const { h11, h12, h21, h22, starBox, rightBox, rightBox2, rightBoxBtn, languageBtn } = dict.landingPage;

    return (
        <main className='bg-[url("/cover.jpg")] bg-cover bg-top bg-no-repeat'>
            <section className='bg-[#120f09] bg-opacity-90 flex flex-col p-4 pb-0 min-h-screen'>
                <CaptainNavbar dict={dict} />
                <section
                    className='flex flex-col items-center justify-center w-full mt-8 max-w-3xl mx-auto px-2'
                >
                    <h1 className={`${playfairDisplay.className} text-center text-7xl`}>{h11}</h1>
                    <h1 className={`${playfairDisplay.className} text-center text-7xl`}>{h12}</h1>
                    <h2 className={`${playfairDisplay.className} text-center text-xl mt-8`}>{h21}</h2>
                    <h2 className={`${playfairDisplay.className} text-center text-xl mt-1`}>{h22}</h2>
                    <button className='mt-8'>
                        <EllipseButton />
                    </button>
                </section>
                <div className='flex-grow'></div>
                <section className='hidden md:flex flex-row w-full justify-between items-end relative isolate'>
                    <div className='flex flex-row gap-6 items-center justify-center border-[1px] border-primary p-2'>
                        <BsStar className='text-primary' />
                        {starBox}
                    </div>
                    <div className='w-[32rem] h-[166px] bg-[#9b9b9a] absolute bottom-0 right-0 flex flex-row'>
                        <Image
                            src="/img/bottomCard.jpg"
                            width={166}
                            height={245}
                            alt='bottom card'
                            className='object-cover'
                        />
                        <div>
                            <article className='p-5 pb-2'>
                                <p className={`${playfairDisplay.className} font-bold text-black mb-2`}>{rightBox}</p>
                                <p>{rightBox2}</p>
                            </article>
                            <Button className={cn('text-white rounded-none ml-5')}>{rightBoxBtn}</Button>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    )
}
