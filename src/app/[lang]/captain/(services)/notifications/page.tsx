import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import React from 'react';

async function getNotifications() {
    const response = await fetch('https://ae.arrive.waysdatalabs.com/node-api/captain/get-sos-notifications', {
        method: 'GET',
        cache: 'no-store'
    });
    const result = await response.json();
    return result;
}

export default async function Notifications({ params: { lang } }: { params: { lang: string } }) {
    const notifications = await getNotifications();
    /* console.log(notifications); */
    return (
        <section className='text-primary w-full sm:w-[70%] mx-auto sm:mt-8 p-4'>
            {
                notifications.length !== 0 ? (
                    notifications.map((notification: any, index: number) => {
                        return (
                            <Link key={index} href={`/${lang}/captain/sos/${notification.roomno}`} className='flex flex-col justify-between items-start bg-white rounded-lg transition-shadow duration-300 shadow-sm hover:shadow-md p-3'>
                                <div className='flex w-full justify-between items-center'>
                                    <p className='text-black'>Room Number: {notification.roomno}</p>
                                    <p>{notification.time}</p>
                                </div>
                                <p className='text-black text-sm mt-4'>Last Message:</p>
                                <div className='flex justify-between items-center gap-4'>
                                    <p>{notification.lastMessage}</p>
                                    <div className='p-1 bg-red-500 w-[22px] h-[22px] rounded-full text-xs text-white'>
                                        <p>+{notification.count}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className='text-center text-black/50'>No SOS Notifications</div>
                )
            }
        </section>
    )
}
