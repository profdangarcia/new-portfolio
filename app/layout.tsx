import type { Metadata } from "next";
import { Poppins, Montserrat, Six_Caps } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const sixCaps = Six_Caps({
  variable: "--font-six-caps",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Dan Garcia | Front-end Developer",
  description:
    "Um desenvolvedor front-end que ama a tecnologia e novos desafios!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${montserrat.variable} ${sixCaps.variable} antialiased`}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
