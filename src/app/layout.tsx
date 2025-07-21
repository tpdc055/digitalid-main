import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enhanced Security Framework - PNG Government Portal",
  description: "Papua New Guinea Government Portal with Enhanced Security Framework for digital government services, end-to-end encryption, and DGA 2022 compliance",
  keywords: ["PNG", "Papua New Guinea", "Government", "Digital Services", "Security", "Encryption", "DGA 2022"],
  authors: [{ name: "PNG Government Digital Services" }],
  creator: "Enhanced Security Framework",
  publisher: "Papua New Guinea Government",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://same-e4r4payzdi-latest.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PNG Government Portal - Enhanced Security Framework",
    description: "Secure digital government services with end-to-end encryption and compliance monitoring",
    url: 'https://same-e4r4payzdi-latest.netlify.app',
    siteName: 'PNG Government Portal',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PNG Government Portal - Enhanced Security Framework',
      },
    ],
    locale: 'en_PG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PNG Government Portal - Enhanced Security Framework",
    description: "Secure digital government services with end-to-end encryption",
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PNG Gov Portal',
    startupImage: [
      {
        url: '/apple-touch-startup-image-768x1004.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  applicationName: 'PNG Government Portal',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />

        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="application-name" content="PNG Government Portal" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PNG Gov Portal" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-square70x70logo" content="/icons/icon-128x128.png" />
        <meta name="msapplication-square150x150logo" content="/icons/icon-192x192.png" />
        <meta name="msapplication-square310x310logo" content="/icons/icon-512x512.png" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('[PWA] Service Worker registered successfully:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('[PWA] Service Worker registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
