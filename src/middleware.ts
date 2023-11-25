import { NextRequest, NextResponse } from "next/server";
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'ar', 'ru', 'fr', 'de', 'it', 'es'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
    const headers = {
        'accept-language': request.headers.get('accept-language') ?? '',
    };
    const languages = new Negotiator({ headers }).languages();
    return match(languages, locales, defaultLocale);
}

async function verifyToken(token: string) {
    try {
        const response = await fetch(`https://ae.arrive.waysdatalabs.com/api/auth/verify-token?token=${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function middleware(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const token = searchParams.get('token');
    const lang = request.nextUrl.pathname.split('/')[1];
    console.log(await verifyToken(token as string), lang);
    const creds = await verifyToken(token as string);
    const { pathname } = request.nextUrl;

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (token && creds.success) {
        const response = NextResponse.next();
        response.cookies.set('token', token, {
            maxAge: 60 * 60 * 24 * creds.num_days_stayed, // 1 year
            path: '/',
            sameSite: 'lax',
            secure: true,
        });
        response.cookies.set('language', creds.language, {
            maxAge: 60 * 60 * 24 * creds.num_days_stayed, // 1 year
            path: '/',
            sameSite: 'lax',
            secure: true,
        });
        response.cookies.set('roomno', creds.roomno, {
            maxAge: 60 * 60 * 24 * creds.num_days_stayed, // 1 year
            path: '/',
            sameSite: 'lax',
            secure: true,
        });
    }

    /* if (!request.cookies.get('token') && request.nextUrl.pathname !== "/" && !request.nextUrl.pathname.includes('captain')) {
        return NextResponse.redirect('https://ae.arrive.waysdatalabs.com/');
    } */

    /* if (!request.cookies.get('ac_token') && request.nextUrl.pathname.includes('captain') && request.nextUrl.pathname !== "/captain") {
        return NextResponse.redirect('https://ae.arrive.waysdatalabs.com/captain');
    } */

    if (lang) {
        const response = NextResponse.next();
        response.cookies.set('language', lang, {
            maxAge: 60 * 60 * 24 * creds.num_days_stayed, // 1 year
            path: '/',
            sameSite: 'lax',
            secure: true,
        });
    }

    if (pathnameHasLocale) return;
    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|cover.jpg|bottomCard.jpg|arrivechat.png).*)',

}