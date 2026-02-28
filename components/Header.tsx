"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import generalData from "@/lib/pageData/general";
import LanguageHandler from "./LanguageHandler";

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

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { language } = useLanguage();
  const { links } = generalData[language].header;

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
          if (link.id) {
            const element = document.querySelector(link.id);
            if (element && isInViewport(element)) focused = link.id;
          }
        }
      }
      if (focused !== focusedElement) setFocusedElement(focused);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, isVisible, focusedElement, links]);

  useEffect(() => {
    setIsMobile(checkIsMobile());
    const onResize = () => setIsMobile(checkIsMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 bg-black/95 shadow-lg" : "-translate-y-full"
      } ${!isHome ? "translate-y-0 bg-black/95" : ""}`}
      onBlur={closeNavigation}
    >
      <div className="container-portfolio">
        <nav className="flex min-h-[60px] items-center justify-between py-3">
          <div className="flex flex-1 items-center justify-between md:flex-initial">
            <Link
              href="/"
              className="font-display text-xl font-bold tracking-widest text-white md:text-2xl"
            >
              DAN GARCIA
            </Link>
            {!isMobile && (
              <ul className="hidden gap-8 md:flex">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.url}
                      className={`text-sm font-medium text-white transition-opacity hover:opacity-80 ${
                        focusedElement === link.id ? "underline underline-offset-4" : ""
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-4">
              <LanguageHandler />
              <button
                type="button"
                className="text-2xl text-white md:hidden"
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
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              showNav ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="flex flex-col gap-4 pb-4">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className="text-sm font-medium text-white hover:opacity-80"
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
