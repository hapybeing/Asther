import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asther | Digital Workspace",
  description: "Focus timer, task manager, and ambient soundscapes.",
  // We removed the manual 'manifest' line here because Next.js auto-detects the file!
  icons: {
    icon: "/favicon.ico",
  },
};

// We removed the explicit 'viewport' export to prevent version conflicts.
// The manifest.json handles the theme color now.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}


