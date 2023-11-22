import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CheckDir from '@/components/custom/CheckDir'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Arrive Chat UAE',
  description: 'Arrive Chat UAE',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir='ltr'>
      <body className={`${inter.className} max-w-screen-2xl mx-auto`}>
        <CheckDir />
        {children}
      </body>
    </html>
  )
}
