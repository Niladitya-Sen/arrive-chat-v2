import { Input } from '@/components/ui/input';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getDictionary } from '../../dictionaries';
import { cookies } from 'next/headers';
import PhoneNoInput from '@/components/custom/PhoneNoInput';

async function getCaptain() {
    const cookieStore = cookies();
    const token = cookieStore.get('ac_token');
    const response = await fetch('https://ae.arrive.waysdatalabs.com/node-api/captain/get-captain', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token?.value}`,
        },
    });
    const result = await response.json();
    return result;
}

export default async function Profile({ params: { lang } }: Readonly<{ params: { lang: string } }>) {
    const dict = await getDictionary(lang);
    const { yourName, yourEmployeeID, yourEmail, yourPhoneNumber, selectLanguage, update } = dict.captain;
    const captain = await getCaptain();
    const { name, employee_id, email, language, phoneno } = captain.captain;

    async function updateCaptain(formData: FormData) {
        "use server";

        const cookieStore = cookies();
        const token = cookieStore.get('ac_token');
        const response = await fetch('https://ae.arrive.waysdatalabs.com/node-api/captain/update-captain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token?.value}`,
            },
            body: JSON.stringify(Object.fromEntries(formData.entries())),
        });
        const result = await response.json();
    }

    return (
        <form action={updateCaptain} className='flex flex-col items-center justify-center gap-4 text-gray-500 max-w-md w-full place-self-center h-screen'>
            <div className='relative isolate w-fit'>
                <svg xmlns="http://www.w3.org/2000/svg" width="102" height="102" viewBox="0 0 102 102" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M50.9994 10.3337C43.8866 10.3324 36.8978 12.1966 30.7307 15.7404C24.5636 19.2842 19.4338 24.3836 15.8533 30.5295C12.2729 36.6754 10.367 43.653 10.326 50.7657C10.2849 57.8783 12.1101 64.8774 15.6194 71.0642C17.9913 67.9816 21.0404 65.4857 24.5309 63.7696C28.0214 62.0534 31.8598 61.1629 35.7494 61.167H66.2494C70.139 61.1629 73.9774 62.0534 77.4679 63.7696C80.9584 65.4857 84.0075 67.9816 86.3794 71.0642C89.8887 64.8774 91.7139 57.8783 91.6728 50.7657C91.6318 43.653 89.7259 36.6754 86.1455 30.5295C82.565 24.3836 77.4352 19.2842 71.2681 15.7404C65.101 12.1966 58.1122 10.3324 50.9994 10.3337ZM91.3763 81.8867C98.1729 73.0262 101.849 62.1672 101.833 51.0003C101.833 22.9251 79.0747 0.166992 50.9994 0.166992C22.9242 0.166992 0.166073 22.9251 0.166073 51.0003C0.149291 62.1673 3.82559 73.0264 10.6225 81.8867L10.5971 81.9782L12.4017 84.0776C17.1692 89.6515 23.0888 94.1254 29.7523 97.1907C36.4157 100.256 43.6647 101.84 50.9994 101.834C61.305 101.853 71.3703 98.7222 79.8473 92.8616C83.4612 90.3647 86.7382 87.4124 89.5972 84.0776L91.4017 81.9782L91.3763 81.8867ZM50.9994 20.5003C46.9549 20.5003 43.076 22.107 40.216 24.9669C37.3561 27.8269 35.7494 31.7058 35.7494 35.7503C35.7494 39.7949 37.3561 43.6738 40.216 46.5337C43.076 49.3936 46.9549 51.0003 50.9994 51.0003C55.044 51.0003 58.9229 49.3936 61.7828 46.5337C64.6427 43.6738 66.2494 39.7949 66.2494 35.7503C66.2494 31.7058 64.6427 27.8269 61.7828 24.9669C58.9229 22.107 55.044 20.5003 50.9994 20.5003Z" fill="#DADADA" />
                </svg>
                <div className='bg-primary w-fit rounded-full p-1 absolute bottom-0 right-0'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                        <path d="M1.56714 7.90301L1 10.1716L3.26857 9.60443L9.83947 3.03353C10.0521 2.82082 10.1716 2.53236 10.1716 2.23159C10.1716 1.93082 10.0521 1.64236 9.83947 1.42965L9.74192 1.3321C9.52921 1.11946 9.24076 1 8.93998 1C8.63921 1 8.35076 1.11946 8.13805 1.3321L1.56714 7.90301Z" fill="white" stroke="white" strokeWidth="1.13428" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1.56714 7.90286L1 10.1714L3.26857 9.60429L8.93998 3.93287L7.23856 2.23145L1.56714 7.90286Z" fill="white" />
                        <path d="M7.2378 2.23145L8.93922 3.93287L7.2378 2.23145ZM6.10352 10.1714H10.6406H6.10352Z" fill="white" />
                        <path d="M7.2378 2.23145L8.93922 3.93287M6.10352 10.1714H10.6406" stroke="white" strokeWidth="1.13428" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            <div className='w-full'>
                <label htmlFor="name" className='text-sm'>{yourName}</label>
                <Input
                    defaultValue={name}
                    name="name"
                    required
                    id='name'
                    placeholder={yourName}
                    className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                />
            </div>
            <div className='w-full'>
                <label htmlFor="Employee ID" className='text-sm'>{yourEmployeeID}</label>
                <Input
                    readOnly
                    defaultValue={employee_id}
                    required
                    id='employee_id'
                    name='employee_id'
                    placeholder={yourEmployeeID}
                    className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                />
            </div>
            <div className='w-full'>
                <label htmlFor="email" className='text-sm'>{yourEmail}</label>
                <Input
                    defaultValue={email}
                    required
                    id='email'
                    name='email'
                    type='email'
                    placeholder={yourEmail}
                    className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                />
            </div>
            <div className='w-full'>
                <label htmlFor="phoneno" className='text-sm'>{yourPhoneNumber}</label>
                <Input
                    defaultValue={phoneno}
                    required
                    name='phoneno'
                    id='phoneno'
                    pattern='[0-9]{10}'
                    placeholder={yourPhoneNumber}
                    className='bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base'
                />
                {/* <PhoneNoInput
                    defaultValue={phoneno}
                /> */}
            </div>
            <div className='w-full'>
                <label htmlFor="language" className='text-sm'>{selectLanguage}</label>
                <Select
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    required
                    name="language"
                    defaultValue={language ?? lang}
                >
                    <SelectTrigger className={cn("bg-transparent border-0 border-b-2 border-gray-500 rounded-none pl-0 font-semibold text-base")}>
                        <SelectValue placeholder={selectLanguage} />
                    </SelectTrigger>
                    <SelectContent className={cn('bg-white text-black')}>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button className='rounded-none uppercase px-14 py-6 text-white font-semibold'>{update}</Button>
        </form>
    )
}
