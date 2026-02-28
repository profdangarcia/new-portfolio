"use client";

import { useEffect, useRef } from "react";

const REPO = "profdangarcia/my-portfolio";
const LABEL = "blog-comment";
const THEME = "github-light";

export function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("repo", REPO);
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("label", LABEL);
    script.setAttribute("theme", THEME);

    container.appendChild(script);

    loadedRef.current = true;
  }, []);

  return <div ref={containerRef} />;
}