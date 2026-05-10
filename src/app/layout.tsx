import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "../styles/globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

const title = "WhoToVoteFor — Match your views to UK party manifestos";
const description =
  "A clean, non-partisan tool that helps UK voters discover which party's manifesto best matches their views. Privacy-first; your answers never leave your device.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s — WhoToVoteFor" },
  description,
  applicationName: "WhoToVoteFor",
  keywords: [
    "UK general election",
    "manifesto",
    "voting",
    "survey",
    "Labour",
    "Conservative",
    "Liberal Democrats",
    "Green",
    "Reform UK",
    "SNP",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title,
    description,
    siteName: "WhoToVoteFor",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
