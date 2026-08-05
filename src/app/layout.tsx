import { AppShell } from '@/components/shell/app-shell'
import { CustomProvider } from '@/lib/custom/store'
import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

// Self-hosted by Next rather than fetched from Google at runtime, so the type
// never falls back mid-load and the site works offline on a train.
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' })

export const metadata: Metadata = {
  title: {
    template: '%s · The Crux of AI',
    default: 'The Crux of AI — The AIML Learning Lab',
  },
  description:
    'Weekend sessions from a BITS Pilani WILP M.Tech in AI & ML, rebuilt as things you can drag. Plain English first, the maths fully labelled underneath.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <CustomProvider>
          <AppShell>{children}</AppShell>
        </CustomProvider>
      </body>
    </html>
  )
}
