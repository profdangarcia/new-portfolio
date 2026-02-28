"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Github } from "lucide-react";

export interface TipBoxData {
  title: string;
  message: string;
  url: string;
}

interface TipBoxProps {
  data: TipBoxData;
}

export default function TipBox({ data }: TipBoxProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="mt-12 flex flex-col items-center gap-2 rounded-lg border border-[var(--text)]/15 bg-[var(--background)] p-6 transition-shadow hover:shadow-md"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div className="flex items-center gap-2">
        {visible ? (
          <ChevronDown className="size-5 animate-bounce text-[var(--text-title)]" />
        ) : (
          <ChevronUp className="size-5 animate-bounce text-[var(--text-title)]" />
        )}
        <span className="font-display text-lg font-bold tracking-wide text-[var(--text-title)]">
          {data.title}
        </span>
      </div>
      <Link
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[var(--text)] transition-colors hover:text-[var(--text-title)]"
      >
        <Github className="size-5" />
        <span className="text-sm">{data.message}</span>
      </Link>
    </div>
  );
}
