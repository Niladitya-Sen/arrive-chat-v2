import { NextRequest, NextResponse } from "next/server";

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
    const language = searchParams.get('language');

    console.log(await verifyToken(token as string));
    const creds = await verifyToken(token as string);

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
        return response;
    }

    /* if (!request.cookies.get('token') && request.nextUrl.pathname !== "/" && !request.nextUrl.pathname.includes('captain')) {
        return NextResponse.redirect('https://ae.arrive.waysdatalabs.com/');
    } */

    /* if (!request.cookies.get('ac_token') && request.nextUrl.pathname.includes('captain') && request.nextUrl.pathname !== "/captain") {
        return NextResponse.redirect('https://ae.arrive.waysdatalabs.com/captain');
    } */

    if (language) {
        const response = NextResponse.next();
        response.cookies.set('language', language, {
            maxAge: 60 * 60 * 24 * creds.num_days_stayed, // 1 year
            path: '/',
            sameSite: 'lax',
            secure: true,
        });
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|cover.jpg|bottomCard.jpg|arrivechat.png).*)',

}