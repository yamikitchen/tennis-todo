import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TENNIS TODO | 俺様のタスク管理',
  description: '全国選抜チームによるかっこいいタスク管理',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="dark h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}
