"use client";

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
