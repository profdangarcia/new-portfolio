"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import generalData from "@/lib/pageData/general";
import type { Locale } from "@/app/actions/locale";

function isInViewport(el: Element | null): boolean {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) / 2
  );
}

function checkIsMobile(): boolean {
  if (typeof window === "undefined") return true;
  return window.innerWidth < 768;
}

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { links } = generalData[locale].header;

  const [isVisible, setIsVisible] = useState(!isHome);
  const [showNav, setShowNav] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [focusedElement, setFocusedElement] = useState("");

  const closeNavigation = useCallback(() => {
    setShowNav(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      if (window.pageYOffset >= windowHeight && !isVisible && isHome) {
        setIsVisible(true);
      }
      if (window.pageYOffset < windowHeight && isVisible && isHome) {
        setIsVisible(false);
        setShowNav(false);
      }

      let focused = "";
      if (isHome) {
        for (const link of links) {
          const id = "id" in link ? link.id : null;
          if (id) {
            const element = document.querySelector(id);
            if (element && isInViewport(element)) focused = id;
          }
        }
      }
      if (focused !== focusedElement) setFocusedElement(focused);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, isVisible, focusedElement, locale]);

  useEffect(() => {
    setIsMobile(checkIsMobile());
    const onResize = () => setIsMobile(checkIsMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`left-0 right-0 top-0 z-10 min-h-[5.75rem] transition-all duration-500 ease-in-out ${
        pathname === "/" ? "fixed" : "relative"
      } ${
        isVisible ? "translate-y-0" : pathname === "/" ? "-translate-y-[6.375rem]" : "translate-y-0"
      } bg-white shadow-[_-0.3125rem_0.625rem_0.75rem_-0.625rem_rgba(201,201,201,0.67)]`}
      style={{
        maxHeight: showNav ? "31.25rem" : "5.75rem",
        overflow: "hidden",
      }}
      onBlur={closeNavigation}
    >
      <div className="container-portfolio">
        <nav className="flex h-[5.75rem] items-center justify-between">
          <div className="flex flex-1 items-center justify-between md:flex-initial md:min-w-[6.875rem]">
            <Link
              href="/"
              className="font-display text-[2.25rem] font-normal text-black transition-all duration-200 hover:text-[2.375rem] md:text-[3rem] md:hover:text-[3.125rem]"
            >
              DAN GARCIA
            </Link>
            {!isMobile && (
              <ul className="hidden items-center md:flex md:gap-0 [&_li:not(:last-child)]:mr-2.5">
                {links.map((link) => (
                  <li key={link.name} className="h-[3.75rem] w-[3.75rem] text-center leading-[3.75rem]">
                    <Link
                      href={link.url}
                      className={`block text-center no-underline transition-colors duration-200 hover:text-[#666] hover:text-base ${
                        focusedElement === ("id" in link ? link.id : "")
                          ? "text-[#666] text-base"
                          : "text-black"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="text-[#666] md:hidden"
                style={{ fontSize: "1.4375rem" }}
                onClick={() => setShowNav((prev) => !prev)}
                aria-label="Menu"
                aria-expanded={showNav}
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </nav>
        {isMobile && (
          <div
            className={`flex items-center justify-center transition-opacity duration-200 md:hidden ${
              showNav ? "opacity-100" : "opacity-0"
            }`}
          >
            <ul className="mt-5 w-full list-none">
              {links.map((link) => (
                <li
                  key={link.name}
                  className="h-[2.8125rem] w-full border-t border-[#f7f7f7] text-center leading-[2.8125rem]"
                >
                  <Link
                    href={link.url}
                    className="block text-center text-black no-underline transition-colors duration-200 hover:text-[#666] hover:text-base"
                    onClick={() => setShowNav(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
