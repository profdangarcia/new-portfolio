"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import generalData from "@/lib/pageData/general";
import type { Locale } from "@/app/actions/locale";

/** Igual ao antigo: foco quando o topo do elemento está em ou acima de elementHeight/2 do topo da viewport */
function isInViewport(el: Element | null): boolean {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const elementHeight = el.clientHeight;
  return (
    rect.top <= elementHeight / 2 &&
    rect.left >= 0 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/** Antigo usava 1024px (medium), não 768px */
function checkIsMobile(): boolean {
  if (typeof window === "undefined") return true;
  return window.innerWidth < 1024;
}

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { links } = generalData[locale].header;

  const [isVisible, setIsVisible] = useState(!isHome);
  const isVisibleRef = useRef(isVisible);
  isVisibleRef.current = isVisible;

  const [showNav, setShowNav] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [focusedElement, setFocusedElement] = useState("");

  const closeNavigation = useCallback(() => {
    setShowNav(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const visible = isVisibleRef.current;

      if (window.pageYOffset >= windowHeight && !visible && isHome) {
        setIsVisible(true);
      }
      if (window.pageYOffset < windowHeight && visible && isHome) {
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
      setFocusedElement((prev) => (focused !== prev ? focused : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, links]);

  /** Sincroniza visibilidade ao mudar de rota: fora da home o header fica sempre visível */
  useEffect(() => {
    if (!isHome) setIsVisible(true);
  }, [isHome]);

  /** Na rota /blog (ou /blog/...) o link Blog fica em destaque */
  function isLinkInFocus(link: { url: string; name: string; id?: string }): boolean {
    if (isHome) {
      return link.id != null && focusedElement === link.id;
    }
    return pathname === link.url || pathname.startsWith(link.url + "/");
  }

  useEffect(() => {
    setIsMobile(checkIsMobile());
    const onResize = () => setIsMobile(checkIsMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`left-0 right-0 top-0 z-10 min-h-[5.75rem] w-full overflow-hidden bg-white shadow-[_-5px_10px_12px_-10px_rgba(201,201,201,0.67)] transition-all duration-500 ease-in-out ${
        pathname === "/" ? "fixed" : "relative"
      } ${
        isVisible ? "translate-y-0" : pathname === "/" ? "-translate-y-[6.375rem]" : "translate-y-0"
      }`}
      style={{
        maxHeight: showNav ? "31.25rem" : "5.75rem",
      }}
      onBlur={closeNavigation}
    >
      <div className="container-portfolio">
        <nav>
          {/* VisibleContent: flex space-between, height 92px */}
          <div className="flex h-[5.75rem] items-center justify-between">
            <Link
              href="/"
              className="min-w-[6.875rem] shrink-0 font-display text-[2.25rem] font-normal text-[#000] underline decoration-[var(--logo-underline)] decoration-2 underline-offset-2 transition-all duration-200 hover:text-[2.375rem] md:text-[3rem] md:hover:text-[3.125rem]"
            >
              DAN GARCIA
            </Link>

            {!isMobile && (
              <ul
                className="flex list-none items-center justify-end gap-[0.625rem]"
                style={{ marginTop: 0 }}
              >
                {links.map((link, index) => {
                  const linkWithId = link as { url: string; name: string; id?: string };
                  const inFocus = isLinkInFocus(linkWithId);

                  return (
                    <li
                      key={link.name}
                      className="block shrink-0 border-0 text-center"
                      style={{ width: "3.75rem" }}
                    >
                      <Link
                        href={link.url}
                        className={`block no-underline transition-colors duration-200 ease-in hover:text-[#666] ${
                          inFocus ? "text-[#666] text-[1rem]" : "text-[#000] text-inherit"
                        }`}
                        style={{
                          height: "2.8125rem",
                          lineHeight: "2.8125rem",
                        }}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <button
              type="button"
              className="shrink-0 text-[#666] lg:hidden"
              style={{ fontSize: "1.4375rem" }}
              onClick={() => setShowNav((prev) => !prev)}
              aria-label="Menu"
              aria-expanded={showNav}
            >
              <Menu className="size-6" />
            </button>
          </div>

          {/* MobileNavigation: opacity 0/1, transition 0.2s ease-in */}
          {isMobile && (
            <div
              className="flex items-center justify-center lg:hidden"
              style={{
                opacity: showNav ? 1 : 0,
                transition: "opacity 0.2s ease-in",
              }}
            >
              <ul className="mt-5 w-full list-none">
                {links.map((link) => {
                  const linkWithId = link as { url: string; name: string; id?: string };
                  const inFocus = isLinkInFocus(linkWithId);

                  return (
                    <li
                      key={link.name}
                      className="w-full border-t border-[#f7f7f7] text-center"
                      style={{
                        height: "2.8125rem",
                        lineHeight: "2.8125rem",
                      }}
                    >
                      <Link
                        href={link.url}
                        className={`block no-underline transition-colors duration-200 ease-in hover:text-[#666] hover:text-[1rem] ${
                          inFocus ? "text-[#666] text-[1rem]" : "text-[#000] text-inherit"
                        }`}
                        onClick={() => setShowNav(false)}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
