"use client";

export const useCookies = () => {
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
        }
        return undefined;
    };

    const setCookie = (name: string, value: string, days: number, path: string) => {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=${path}`;
    };

    const deleteCookie = (name: string) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    };

    return { getCookie, setCookie, deleteCookie };
};
