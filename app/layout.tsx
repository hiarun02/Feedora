import type {Metadata} from "next";
import {Geist, Geist_Mono, Poppins} from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import AppShell from "@/components/AppShell";
import {ThemeProvider} from "@/components/theme-provider";
import AuthProvider from "@/components/AuthProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feedora - Collect and Analyze User Feedback Seamlessly",
  description: "Seamlessly collect and analyze user feedback with Feedora.",
  icons: {
    icon: "/favicon.svg",
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
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppShell footer={<Footer />}>{children}</AppShell>
          </AuthProvider>
        </ThemeProvider>
        <script
          id="feedora-widget-script"
          src="http://feedora.hiarun.me/widget/widget.js"
          data-project-id="3"
          data-api-url="http://feedora.hiarun.me"
          defer
        ></script>
      </body>
    </html>
  );
}
