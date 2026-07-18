import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/Footer";
import { WebSiteJsonLd, OrganizationJsonLd, ServiceJsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WSDC Academy | World Schools Debate Coaching & Training",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "A real training system for World Schools Debate: structured curriculum, judged practice rounds, and written feedback after every session. Year-round online coaching. Free consultation.",
  keywords: [
    "World Schools Debate coaching",
    "World Schools Debate classes",
    "World Schools Debate online",
    "World Schools Debate training",
    "WSDC training",
    "WSDC coaching",
    "WSDC Academy",
    "World Schools Debate camp",
    "World Schools Debate summer program",
    "how to make USA Debate team",
    "USA Debate application",
    "NSDA World Schools Debate",
    "World Schools Debate format",
    "World Schools Debate tutor",
    "world schools debate prep",
    "impromptu debate training",
    "debate coaching online USA",
    "NSDA Nationals World Schools",
    "TFA World Schools",
    "World Schools Debating Championships",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "WSDC Academy | World Schools Debate Coaching & Training",
    description:
      "A real training system for World Schools Debate: structured curriculum, judged practice rounds, and written feedback after every session. Free consultation.",
    url: '/',
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: '/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: "WSDC Academy: World Schools Debate Coaching & Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WSDC Academy | World Schools Debate Coaching & Training",
    description:
      "A real training system for World Schools Debate: structured curriculum, judged rounds, written feedback every session. Free consultation.",
    images: ['/images/og-home.jpg'],
  },
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

export const viewport: Viewport = {
  themeColor: '#0d2240',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <WebSiteJsonLd />
        <OrganizationJsonLd />
        <ServiceJsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
