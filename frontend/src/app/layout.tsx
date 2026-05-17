import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalPushPopup from "@/components/GlobalPushPopup";
import ActionModal from "@/components/ActionModal";
import { AppProvider } from "@/context/AppContext";

const adsenseClient =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-2777699093936446";

export const metadata: Metadata = {
  title: "Laptop Duniya - Find the Best Laptops, Deals & Reviews",
  description: "Detailed analysis, expert reviews, ultimate buying guides, verified specs, and lowest live prices of the best laptops from top brands like Apple, Dell, HP, Lenovo & Asus.",
  keywords: ["best laptops", "laptop reviews", "laptop deals", "laptop specs", "gaming laptops", "student laptops"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://laptopduniya.in",
    siteName: "Laptop Duniya",
    title: "Laptop Duniya - Find the Best Laptops & Deals",
    description: "Detailed analysis, expert reviews, ultimate buying guides, verified specs, and lowest live prices of the best laptops.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laptop Duniya - Expert Laptop Advice",
    description: "Your ultimate guide for laptop deals, news, and technical analysis.",
  },
  metadataBase: new URL("https://laptopduniya.in"),
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
        <AppProvider>
          <Navbar />
          <main className="flex-1 bg-background">
            {children}
          </main>
          <Footer />
          <GlobalPushPopup />
          <ActionModal />
        </AppProvider>
      </body>
    </html>
  );
}
