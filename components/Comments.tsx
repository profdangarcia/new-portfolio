"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const REPO = "profdangarcia/new-portfolio";
const LABEL = "blog-comment";
const THEME = "github-light";

export function Comments() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !container.isConnected) return;

    const cleanup = () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
      const iframe = container.querySelector("iframe");
      if (iframe) iframe.remove();
    };

    cleanup();

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", REPO);
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("label", LABEL);
    script.setAttribute("theme", THEME);
    scriptRef.current = script;
    container.appendChild(script);

    return () => {
      cleanup();
    };
  }, [pathname]);

  return <div ref={containerRef} id="inject-comments-utterances" />;
}
