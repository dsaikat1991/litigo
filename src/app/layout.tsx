import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://mylitigo.com"),
  title: "Litigo — Your legal memory",
  description:
    "Litigo preserves the case knowledge, arguments, and research an advocate builds over a career, and makes it findable again.",
};

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
// Only report real visitors — local dev/testing traffic shouldn't pollute
// the account, so this only loads for an actual production deployment.
const shouldLoadAnalytics = process.env.NODE_ENV === "production" && !!gaMeasurementId;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      {shouldLoadAnalytics && <GoogleAnalytics gaId={gaMeasurementId} />}
      <SpeedInsights />
    </html>
  );
}
