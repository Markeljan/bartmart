import "@/app/globals.css";
import type { Metadata } from "next";
import { Fredoka, Roboto_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Web3Provider } from "@/components/web3-provider";

const fredoka = Fredoka({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BartMart",
  description: "The simplest intent market",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${robotoMono.variable} antialiased`}>
        <Web3Provider cookies={cookies}>{children}</Web3Provider>
      </body>
    </html>
  );
}
