import { Geist, Geist_Mono } from 'next/font/google'

/**
 * Import the UI package's global styles first, then import the app's global styles to override the variables of colors,
 * because UI package's global styles are used in all apps and each app also has its own global styles.
 */
import '@workspace/ui/globals.css'
import './globals.css'

import { Providers } from '@/components/providers'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
