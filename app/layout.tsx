import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Thông Tin Các Quốc Gia Trên Thế Giới',
  description: 'Khám phá thông tin về các quốc gia trên thế giới',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}