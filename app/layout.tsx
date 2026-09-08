import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://luxe-lace-hershey.vercel.app"),
  title: {
    default: "Luxe & Lace | Designer Dress Rental in Hershey",
    template: "%s | Luxe & Lace",
  },
  description: "Rent beautiful designer dresses in Hershey for weddings, parties, proms, and every special occasion.",
  keywords: ["dress rental", "designer dress rental", "Hershey dress rental", "formal dresses", "wedding guest dresses"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Luxe & Lace",
    title: "Luxe & Lace | Designer Dress Rental in Hershey",
    description: "Find your perfect look and rent a beautiful dress for your next special occasion in Hershey.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Elegant dress from Luxe & Lace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxe & Lace | Designer Dress Rental in Hershey",
    description: "Rent a beautiful dress for your next special occasion in Hershey.",
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${newsreader.variable}`}>
        <Navbar />
        <main className="min-h-screen bg-paper">{children}</main>
        <footer className="border-t border-ink/10 bg-paper-deep">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-4 text-sm text-secondary-500">
            <span className="font-semibold text-ink">Luxe & Lace — Hershey</span>
            <nav className="flex flex-wrap gap-4">
              <a href="/support" className="hover:text-primary-600">Support</a>
              <a href="/privacy" className="hover:text-primary-600">Privacy</a>
              <a href="/terms" className="hover:text-primary-600">Terms</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
