"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/app/actions/locale";
import { setLocaleCookie } from "@/app/actions/locale";
import { mapPostSlug } from "@/lib/postSlugMap";
import ThemeToggle from "@/components/ThemeToggle";

interface LanguageHandlerProps {
  locale: Locale;
}

export default function LanguageHandler({ locale }: LanguageHandlerProps) {
  const router = useRouter();
  const pathname = usePathname() || "/";

  function buildBlogPath(
    targetLocale: Locale,
    currentPath: string,
  ): string | null {
    // PT blog list or post
    if (currentPath === "/blog" || currentPath.startsWith("/blog/")) {
      if (targetLocale === "pt") return currentPath;

      if (currentPath === "/blog") return "/en/blog";

      const slug = currentPath.replace("/blog/", "");
      const mapped = mapPostSlug(slug, "pt", "en");
      return mapped ? `/en/blog/${mapped}` : "/en/blog";
    }

    // EN blog list or post
    if (currentPath === "/en/blog" || currentPath.startsWith("/en/blog/")) {
      if (targetLocale === "en") return currentPath;

      if (currentPath === "/en/blog") return "/blog";

      const slug = currentPath.replace("/en/blog/", "");
      const mapped = mapPostSlug(slug, "en", "pt");
      return mapped ? `/blog/${mapped}` : "/blog";
    }

    // Outras rotas: mantém o path atual e só troca o cookie.
    return currentPath;
  }

  async function handleSetLocale(newLocale: Locale) {
    if (newLocale === locale) return;

    await setLocaleCookie(newLocale);

    const nextPath = buildBlogPath(newLocale, pathname);

    if (nextPath && nextPath !== pathname) {
      router.push(nextPath);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="relative flex h-10 w-full items-center justify-end border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="container-portfolio flex h-full items-center justify-end gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSetLocale("en")}
            className="focus-ring rounded p-0.5 transition-opacity duration-200 hover:opacity-80"
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
            className="focus-ring rounded p-0.5 transition-opacity duration-200 hover:opacity-80"
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

