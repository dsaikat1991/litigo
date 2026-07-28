import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Manrope } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DeferredGoogleAnalytics } from "@/components/analytics/deferred-google-analytics";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Marketing-page body copy only (see src/app/page.tsx) — the dashboard and
// the rest of the product still read on Inter via --font-sans.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mylitigo.com"),
  title: "Litigo — Your legal memory",
  description:
    "Litigo preserves the case knowledge, arguments, and research an advocate builds over a career, and makes it findable again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plexMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
        <DeferredGoogleAnalytics />
      </body>
    </html>
  );
}
