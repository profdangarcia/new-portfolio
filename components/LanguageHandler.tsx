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
    <div className="relative flex h-10 w-full items-center justify-end bg-[#f7f7f7]">
      <div className="container-portfolio flex h-full items-center justify-end">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSetLocale("en")}
            className="rounded p-0.5 transition-opacity duration-200 hover:opacity-80"
            aria-pressed={locale === "en"}
            aria-label="English"
          >
            <Image
              src="/us.svg"
              alt="English"
              width={30}
              height={30}
              className={`h-[1.875rem] w-[1.875rem] object-contain ${
                locale !== "en" ? "opacity-50" : "opacity-100"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => handleSetLocale("pt")}
            className="rounded p-0.5 transition-opacity duration-200 hover:opacity-80"
            aria-pressed={locale === "pt"}
            aria-label="Português"
          >
            <Image
              src="/br.svg"
              alt="Português BR"
              width={30}
              height={30}
              className={`h-[1.875rem] w-[1.875rem] object-contain ${
                locale !== "pt" ? "opacity-50" : "opacity-100"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
