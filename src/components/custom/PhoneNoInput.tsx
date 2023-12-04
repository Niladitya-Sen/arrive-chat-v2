"use client";

import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function PhoneNoInput({ defaultValue }: Readonly<{ defaultValue: string }>) {
    return (
        <PhoneInput
            country={'ae'}
            inputProps={{
                required: true,
                pattern: '[0-9]{10}',
                maxLength: 10,
                minLength: 10,
                name: 'phone_number',
                defaultValue: defaultValue,
            }}
            containerClass='w-full bg-transparent !border-0 !border-b-2 !border-gray-500 !rounded-none pl-0 font-semibold text-base'
            inputClass='!bg-transparent !w-full py-[0.6rem] !border-0'
            specialLabel=''
            showDropdown
            dropdownClass='!bg-[#2f2f2f]'
            buttonStyle={{
                backgroundColor: 'transparent',
                border: 'none',
            }}
            countryCodeEditable={false}
        />
    )
}
