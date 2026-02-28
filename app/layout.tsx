import type { Metadata } from "next";
import { Poppins, Montserrat, Six_Caps } from "next/font/google";
import { getLocaleCookie } from "@/app/actions/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleCookie();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${montserrat.variable} ${sixCaps.variable} antialiased`}
      >
        <Header locale={locale} />
        <main className="min-h-screen">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
