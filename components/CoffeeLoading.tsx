"use client";

import { useEffect, useLayoutEffect, useState } from "react";

const STORAGE_KEY = "portfolio-coffee-loaded";

export default function CoffeeLoading() {
  // Começa visível para a primeira pintura ser o café (não o Banner)
  const [showLoad, setShowLoad] = useState(true);
  const [showCup, setShowCup] = useState(false);
  const [renderOverlay, setRenderOverlay] = useState(true);

  // Antes da primeira pintura: se já viu o café, esconde o overlay na hora
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const alreadyLoaded = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyLoaded === "true") {
      setRenderOverlay(false);
      setShowLoad(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "true") return;

    const t1 = setTimeout(() => setShowCup(true), 50);
    const t2 = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setShowCup(false);
      setShowLoad(false);
    }, 3000);
    const t3 = setTimeout(() => setRenderOverlay(false), 3550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!renderOverlay) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111] transition-opacity duration-500 ease-in-out"
      style={{
        opacity: showLoad ? 1 : 0,
        pointerEvents: showLoad ? "auto" : "none",
        zIndex: showLoad ? 100 : -20,
      }}
      aria-hidden="true"
    >
      {/* Wrapper centralizado por flexbox (mais estável no mobile) */}
      <div className="flex shrink-0 items-center justify-center">
        <div
          className="relative h-[6.25rem] w-[8.75rem] rounded-b-[3.125rem] border-[0.375rem] border-[#111] bg-white shadow-[0_0_0_0.375rem_white] md:h-[8.75rem] md:w-[11.25rem] md:rounded-b-[4.375rem]"
          style={{
            transform: showCup ? "translateX(0)" : "translateX(-100vw)",
            transition: "transform 1s ease-in-out",
          }}
        >
          {/* Coffee fill animation */}
          <div
            className={`absolute inset-x-[0.375rem] bottom-[0.375rem] rounded-b-[2.75rem] bg-[#3d2314] md:rounded-b-[4rem] ${showCup ? "coffee-fill" : ""}`}
            style={{ height: showCup ? undefined : "0%" }}
          />
          {/* Handle */}
          <div
            className="absolute left-[9.125rem] top-[-0.125rem] z-[100] h-[3.125rem] w-[2.1875rem] rounded-r-lg border-[0.375rem] border-white border-l-transparent bg-transparent md:left-[11.625rem] md:top-[0.125rem] md:h-[4.375rem] md:w-[2.5rem] md:rounded-r-3xl"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
