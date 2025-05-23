import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Thông Tin Các Quốc Gia Trên Thế Giới',
  description: 'Khám phá thông tin về các quốc gia trên thế giới',
  icons: {
    icon: '/icons8-favicon-3d-fluency-32.png',
  },
  openGraph: {
    title: 'Thông Tin Các Quốc Gia Trên Thế Giới',
    description: 'Khám phá thông tin về các quốc gia trên thế giới',
    url: 'https://worldatlasinfo.vercel.app/', // Thay bằng domain thật của bạn
    siteName: 'REST Countries Info',
    images: [
      {
        url: '/og-image.png', // Đặt ảnh này vào thư mục public, kích thước chuẩn 1200x630px
        width: 1200,
        height: 630,
        alt: 'REST Countries Info',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}