import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NotificationProvider } from '@/components/NotificationToast'
import PWAInitializer from '@/components/PWAInitializer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlowGrow - Property NFT Marketplace',
  description: 'Decentralized property marketplace with NFT tokenization on Flow blockchain',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FlowGrow',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'FlowGrow',
    title: 'FlowGrow - Property NFT Marketplace',
    description: 'Decentralized property marketplace with NFT tokenization on Flow blockchain',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlowGrow - Property NFT Marketplace',
    description: 'Decentralized property marketplace with NFT tokenization on Flow blockchain',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FlowGrow" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <NotificationProvider>
            <PWAInitializer />
            <div className="min-h-screen bg-background">
              {children}
            </div>
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
