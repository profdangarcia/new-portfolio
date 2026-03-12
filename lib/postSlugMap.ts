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

