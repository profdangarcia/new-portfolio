"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "NEXT_THEME";
const MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export type Theme = "light" | "dark" | "system";

export async function setThemeCookie(theme: Theme) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, theme, {
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax",
  });
}

export async function getThemeCookie(): Promise<Theme> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
}
