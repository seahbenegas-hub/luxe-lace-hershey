import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-secondary-50">{children}</main>
      </body>
    </html>
  );
}
