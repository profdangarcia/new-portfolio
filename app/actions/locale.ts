"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "NEXT_LOCALE";
const MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export type Locale = "pt" | "en";

export async function setLocaleCookie(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax",
  });
}

export async function getLocaleCookie(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (value === "pt" || value === "en") return value;
  return "en";
}
