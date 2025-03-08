import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Catch the Stick Game",
  description: "A fun and addictive game where you catch falling sticks before they hit the ground. Test your reflexes and see how many sticks you can catch! Perfect for quick breaks and casual gaming.",
  keywords: ["game", "catch", "sticks", "reflexes", "browser game", "casual game"],
  authors: [{ name: "Kesara Gamlath" }],
  openGraph: {
    title: "Catch the Stick Game",
    description: "Test your reflexes by catching falling sticks in this addictive browser game!",
    type: "website",
  },
};

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
