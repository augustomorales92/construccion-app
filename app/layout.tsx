import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import { Geist } from 'next/font/google'
//import Layout from './(auth-pages)/layout'
import './globals.css'
import  getUserAuth, { getLoggedInUser } from '@/actions/auth'
import Layout from '@/components/layout/Layout'

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUserAuth()
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/*    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full flex justify-between items-center p-3 mx-10 text-sm">
              <div className="flex gap-5 items-center font-semibold">
                <Link href={'/'} className='flex gap-2 items-center'>
                  <BrickWall className="w-7 h-7" />
                  <span className='text-lg'>
                    Busca tu obra
                  </span>
                </Link>
              </div>
               {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />} 
            </div>
          </nav>
          <main className="w-full flex flex-col min-h-custom items-center">
            <div className="flex-grow w-full overflow-auto">{children}</div>
          </main>
          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 h-16">
            <p>© 2023 ConstructApp. Todos los derechos reservados.</p>
            <ThemeSwitcher />
          </footer> */}
          <Layout user={user}>{children}</Layout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
