import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NotificationProvider } from '@/components/NotificationToast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlowEstate - Decentralized Real Estate NFTs',
  description: 'Turn real-world properties into tradeable NFTs on the Flow blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <NotificationProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
