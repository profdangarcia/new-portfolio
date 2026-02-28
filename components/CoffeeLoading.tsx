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
      <div
        className="absolute left-1/2 top-1/2 h-[100px] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-b-[50px] border-[6px] border-[#111] bg-white shadow-[0_0_0_6px_white] md:h-[140px] md:w-[180px] md:rounded-b-[70px]"
        style={{
          transform: showCup
            ? "translate(-50%, -50%) translateX(0)"
            : "translate(-50%, -50%) translateX(-100vw)",
          transition: "transform 1s ease-in-out",
        }}
      >
        {/* Coffee fill animation */}
        <div
          className={`absolute inset-x-[6px] bottom-[6px] rounded-b-[44px] bg-[#3d2314] md:rounded-b-[64px] ${showCup ? "coffee-fill" : ""}`}
          style={{ height: showCup ? undefined : "0%" }}
        />
        {/* Handle */}
        <div
          className="absolute left-[146px] top-[-2px] z-[100] h-[50px] w-[35px] rounded-r-lg border-[6px] border-white border-l-transparent bg-transparent md:left-[186px] md:top-[2px] md:h-[70px] md:w-[40px] md:rounded-r-3xl"
          aria-hidden
        />
      </div>
    </div>
  );
}
