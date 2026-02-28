"use client";

import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <span className="inline-flex items-center gap-1">
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="sr-only">Carregando</span>
    </span>
  );
}
