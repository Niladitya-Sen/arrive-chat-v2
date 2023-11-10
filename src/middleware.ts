import { NextRequest, NextResponse } from "next/server";

async function verifyToken(token: string) {
    const response = await fetch(`https://ae.arrive.waysdatalabs.com/api/auth/verify-token?token=${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const data = await response.json();
    if (data.success) {
        return true;
    }
}

export async function middleware(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const token = searchParams.get('token');
    const language = searchParams.get('language');

    if (token && await verifyToken(token)) {
        const response = NextResponse.next();
        response.cookies.set('token', token);
        return response;
    }

    if (!request.cookies.get('token') && request.nextUrl.pathname !== "/" && !request.nextUrl.pathname.includes('captain')) {
        return NextResponse.redirect('https://ae.arrive.waysdatalabs.com/');
    }

    if (language) {
        const response = NextResponse.next();
        response.cookies.set('language', language);
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|cover.jpg|bottomCard.jpg|arrivechat.png).*)',

}