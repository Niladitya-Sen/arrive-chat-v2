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
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function middleware(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const token = searchParams.get('token');
    const creds = await verifyToken(token as string);
    const { pathname } = request.nextUrl;
    
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;
    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    const response = NextResponse.redirect(request.nextUrl);

    if (creds.success && creds.language) {
        request.nextUrl.pathname = `/${creds.language}/chat`
        const response = NextResponse.redirect(request.nextUrl);
        response.cookies.set('token', token ?? '', {
            maxAge: 60 * 60 * 24 * creds.num_days_stayed, 
            path: '/',
            sameSite: 'lax',
            secure: true,
        });
        response.cookies.set('language', creds.language, {
            maxAge: 60 * 60 * 24 * creds.num_days_stayed, 
            path: '/',
            sameSite: 'lax',
            secure: true,
        });
        response.cookies.set('roomno', creds.room_number, {
            maxAge: 60 * 60 * 24 * creds.num_days_stayed,
            path: '/',
            sameSite: 'lax',
            secure: true,
        });
        return response;
    }

    if (token && creds.success) {
        response.cookies.set('token', token, {
            maxAge: 60 * 60 * 24 * creds.num_days_stayed, 
            path: '/',
            sameSite: 'lax',
            secure: true,
        });
        if (creds.language) {
            response.cookies.set('language', creds.language, {
                maxAge: 60 * 60 * 24 * creds.num_days_stayed, 
                path: '/',
                sameSite: 'lax',
                secure: true,
            });
        }
        if (creds.roomno) {
            response.cookies.set('roomno', creds.room_number, {
                maxAge: 60 * 60 * 24 * creds.num_days_stayed, 
                path: '/',
                sameSite: 'lax',
                secure: true,
            });
        }
        return response;
    }

    /* if (!request.cookies.get('token') && request.nextUrl.pathname !== "/" && !request.nextUrl.pathname.includes('captain')) {
        return NextResponse.redirect('https://ae.arrive.waysdatalabs.com/');
    } */

    /* if (!request.cookies.get('ac_token') && request.nextUrl.pathname.includes('captain') && request.nextUrl.pathname !== "/captain") {
        return NextResponse.redirect('https://ae.arrive.waysdatalabs.com/captain');
    } */

    return response;
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|services/*|img/*|favicon.ico|cover.jpg|bottomCard.jpg|arrivechat.png).*)',

}