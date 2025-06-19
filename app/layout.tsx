import React from 'react'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '剪刀石頭布蜥蜴史波克 - 即時對戰',
  description: '使用 Next.js 和 Socket.IO 的即時多人對戰遊戲',
  keywords: ['遊戲', '剪刀石頭布', '蜥蜴史波克', '多人對戰', '即時'],
  authors: [{ name: 'Your Name' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#667eea" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
} 