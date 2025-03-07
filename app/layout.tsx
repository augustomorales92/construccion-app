import { ourFileRouter } from '@/app/api/uploadthing/core'
import Layout from '@/components/layout'
import { Toaster } from '@/components/ui/sonner'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { ThemeProvider } from 'next-themes'
import { Geist } from 'next/font/google'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { extractRouterConfig } from 'uploadthing/server'

import './globals.css'

async function UTSSR() {
  await connection()
  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
}

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Busca tu obra',
  description: 'Encuentra tu obra y revisa su avance',
}

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <Suspense fallback={null}>
        <UTSSR />
      </Suspense>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
