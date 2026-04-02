import type { Metadata } from "next";
import TanStackProvider from "@/providers/tanstack-query-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/theme-providers";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/lib/seo";
import "sonner/dist/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dashboard Tax Center Gunadarma",
    template: "%s | Dashboard Tax Center Gunadarma",
  },
  description:
    "Dashboard internal Tax Center Gunadarma untuk mengelola data, konten, dan layanan perpajakan secara terintegrasi.",
  applicationName: "Dashboard Tax Center Gunadarma",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanStackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position="top-center" />
          </ThemeProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
