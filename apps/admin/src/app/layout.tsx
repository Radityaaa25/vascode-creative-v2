import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Vascode Admin — Creative Agency Dashboard",
  description: "Internal admin dashboard for managing clients, projects, and site content with an AI assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body className="antialiased selection:bg-primary/30">
        {children}
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  );
}
