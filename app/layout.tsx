import type { Metadata } from "next";
import { Poppins, Montserrat, Six_Caps } from "next/font/google";
import { getLocaleCookie } from "@/app/actions/locale";
import { getThemeCookie } from "@/app/actions/theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LanguageHandler from "@/components/LanguageHandler";
import CoffeeLoading from "@/components/CoffeeLoading";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://dangarcia-devel.vercel.app"
  ),
  title: {
    default: "Dan Garcia | Front-end Developer",
    template: "%s | Dan Garcia",
  },
  description:
    "Um desenvolvedor front-end que ama a tecnologia e novos desafios!",
  openGraph: {
    type: "website",
  },
  twitter: {
    card: "summary",
  },
  verification: {
    google: "hyVDovsqxQpSLvMzLawu_CkTM5siBtxl1Y6RrNhxpY8",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleCookie();
  const theme = await getThemeCookie();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var c = document.cookie.match(/NEXT_THEME=([^;]+)/);
  var t = c ? c[1] : 'system';
  if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
            `.trim(),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${montserrat.variable} ${sixCaps.variable} antialiased`}
      >
        <ThemeProvider initialTheme={theme}>
          <CoffeeLoading />
          <LanguageHandler locale={locale} />
          <Header locale={locale} />
          <main className="min-h-screen">{children}</main>
          <Footer locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
