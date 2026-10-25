import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { VT323 } from 'next/font/google'
import './globals.css'

const pixel = VT323({ weight: '400', subsets: ['latin'], variable: '--font-pixel' })

export const metadata: Metadata = {
  title: 'Enchantment & Gear Customizer — Minecraft',
  description:
    'Browse every Minecraft enchantment, resolve conflicts, preview enchanted weapons and tools, and customize armor with trims and dyes.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#100010',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={pixel.variable}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
