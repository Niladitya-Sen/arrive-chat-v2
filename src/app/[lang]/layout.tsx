import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CheckDir from '@/components/custom/CheckDir'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Arrive Chat UAE',
  description: 'Arrive Chat UAE',
}

export default function RootLayout({ children, params: { lang } }: Readonly<{ children: React.ReactNode, params: { lang: string } }>) {
  return (
    <html dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${inter.className} max-w-screen-2xl mx-auto overflow-x-hidden`}>
        {/* <CheckDir /> */}
        {children}
      </body>
    </html>
  )
}
