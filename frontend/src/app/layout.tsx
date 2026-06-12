import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalPushPopup from "@/components/GlobalPushPopup";
import ActionModal from "@/components/ActionModal";

const adsenseClient =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-2777699093936446";

export const metadata: Metadata = {
  title: "PhoneRadar - Best Phones, Deals, Reviews & Buying Guides",
  description: "Track smartphone prices, compare specs, read expert reviews, and discover the best mobile deals from brands like Apple, Samsung, Google, OnePlus, Xiaomi, and more.",
  keywords: ["best phones", "mobile reviews", "smartphone deals", "camera phones", "5g phones", "flagship phones"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://phoneradar.in",
    siteName: "PhoneRadar",
    title: "PhoneRadar - Find the Best Phones & Deals",
    description: "Expert smartphone reviews, buying guides, and tracked mobile prices from India's top brands.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhoneRadar - Expert Phone Advice",
    description: "Your guide to phone deals, mobile reviews, camera picks, and buying advice.",
  },
  metadataBase: new URL("https://phoneradar.in"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased h-full">
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>
          <Navbar />
          <main className="flex-1 bg-background">
            {children}
          </main>
          <Footer />
          <GlobalPushPopup />
          <ActionModal />
        </AppProviders>
      </body>
    </html>
  );
}
