"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LanguageHandler() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className="rounded p-1 transition-opacity hover:opacity-80 aria-pressed:ring-2 aria-pressed:ring-white"
        aria-pressed={language === "en"}
        aria-label="English"
      >
        <Image
          src="/us.svg"
          alt="English"
          width={28}
          height={20}
          className={`h-5 w-7 object-contain ${language !== "en" ? "opacity-50" : ""}`}
        />
      </button>
      <button
        type="button"
        onClick={() => setLanguage("pt")}
        className="rounded p-1 transition-opacity hover:opacity-80 aria-pressed:ring-2 aria-pressed:ring-white"
        aria-pressed={language === "pt"}
        aria-label="Português"
      >
        <Image
          src="/br.svg"
          alt="Português BR"
          width={28}
          height={20}
          className={`h-5 w-7 object-contain ${language !== "pt" ? "opacity-50" : ""}`}
        />
      </button>
    </div>
  );
}
