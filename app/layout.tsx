import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Public_Sans } from "next/font/google";
import { FloatingNav } from "@/components/dashboard/floating-nav";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Waste Management Dashboard",
  description: "Dashboard operasional Waste Management Department",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={publicSans.variable}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
            <FloatingNav />
        </ThemeProvider>
      </body>
    </html>
  );
}