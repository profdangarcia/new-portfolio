import type { Locale } from "@/app/actions/locale";

type SlugPair = {
  pt: string;
  en: string;
};

// Mapeamento entre slugs PT/EN para o mesmo post.
export const POST_SLUGS: SlugPair[] = [
  { pt: "nextjs-ssr-e-seo", en: "nextjs-ssr-and-seo" },
  { pt: "entenda-nextjs-ssg-isr", en: "nextjs-ssg-and-isr-power" },
  {
    pt: "ssr-ssg-isr-no-app-router",
    en: "ssr-ssg-isr-in-next-app-router",
  },
  {
    pt: "novo-portfolio-nextjs-cursor",
    en: "nextjs-portfolio-and-cursor",
  },
  {
    pt: "financy-desktop-electron",
    en: "financy-desktop-app-with-electron",
  },
  {
    pt: "vite-8-disponivel",
    en: "vite-8-is-here",
  },
  {
    pt: "react-17-para-19-na-pratica",
    en: "react-17-to-19-in-practice",
  },
];

const byLocale: Record<Locale, Record<string, string>> = {
  pt: {},
  en: {},
};

for (const pair of POST_SLUGS) {
  byLocale.pt[pair.pt] = pair.en;
  byLocale.en[pair.en] = pair.pt;
}

export function mapPostSlug(
  currentSlug: string,
  fromLocale: Locale,
  toLocale: Locale,
): string | null {
  if (fromLocale === toLocale) return currentSlug;
  const table = byLocale[fromLocale];
  return table[currentSlug] ?? null;
}

