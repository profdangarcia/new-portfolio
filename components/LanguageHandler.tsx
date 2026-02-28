"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Locale } from "@/app/actions/locale";
import { setLocaleCookie } from "@/app/actions/locale";

interface LanguageHandlerProps {
  locale: Locale;
}

export default function LanguageHandler({ locale }: LanguageHandlerProps) {
  const router = useRouter();

  async function handleSetLocale(newLocale: Locale) {
    await setLocaleCookie(newLocale);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => handleSetLocale("en")}
        className="rounded p-1 transition-opacity hover:opacity-80 aria-pressed:ring-2 aria-pressed:ring-white"
        aria-pressed={locale === "en"}
        aria-label="English"
      >
        <Image
          src="/us.svg"
          alt="English"
          width={28}
          height={20}
          className={`h-5 w-7 object-contain ${locale !== "en" ? "opacity-50" : ""}`}
        />
      </button>
      <button
        type="button"
        onClick={() => handleSetLocale("pt")}
        className="rounded p-1 transition-opacity hover:opacity-80 aria-pressed:ring-2 aria-pressed:ring-white"
        aria-pressed={locale === "pt"}
        aria-label="Português"
      >
        <Image
          src="/br.svg"
          alt="Português BR"
          width={28}
          height={20}
          className={`h-5 w-7 object-contain ${locale !== "pt" ? "opacity-50" : ""}`}
        />
      </button>
    </div>
  );
}
