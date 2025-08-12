import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "IshqLine — Where Hearts Connect & Love Begins",
  description:
    "Discover meaningful connections on IshqLine — your modern dating app designed to spark real love stories. Join now and find your perfect match!",
  keywords:
    "dating, love, relationships, match, singles, connect, chat, meet, IshqLine",
  authors: [{ name: "IshqLine Team", url: "https://ishqline.com" }],
  openGraph: {
    title: "IshqLine — Where Hearts Connect & Love Begins",
    description:
      "Join IshqLine to meet, chat, and connect with singles who are ready for meaningful relationships.",
    url: "https://ishqline.com",
    siteName: "IshqLine",
    images: [
      {
        url: "https://ishqline.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IshqLine - Dating App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IshqLine — Where Hearts Connect & Love Begins",
    description:
      "Discover meaningful connections on IshqLine — your modern dating app designed to spark real love stories.",
    images: ["https://ishqline.com/twitter-image.jpg"],
    creator: "@IshqLine",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar onLogout={"handleLogout"} />
        {children}
      </body>
    </html>
  );
}
