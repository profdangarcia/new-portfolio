"use client";

import { useState } from "react";
import Link from "next/link";
import { Github } from "lucide-react";

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
      className="tip-box absolute z-[9] flex h-[15.625rem] w-[18.75rem] flex-col rounded-t-[0.25rem] bg-[var(--background)] p-2.5 pt-0 shadow-[0.75rem_-0.625rem_0.625rem_rgba(0,0,0,0.1)] transition-[right,bottom] duration-500 ease-in-out md:h-auto md:min-h-[12.5rem] md:w-[15.625rem] md:flex-row md:items-center md:justify-center md:rounded-l-[0.25rem] md:rounded-tr-none md:pt-2.5"
      style={{
        ["--tip-bottom" as string]: visible ? 0 : -200,
        ["--tip-right" as string]: visible ? 0 : -250,
      } as React.CSSProperties}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div
        className="flex cursor-pointer items-center justify-center md:ml-[-5.3125rem] md:mr-[-4.0625rem] md:h-[3.125rem] md:flex-shrink-0 md:rotate-[-90deg]"
        onClick={() => setVisible((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setVisible((v) => !v)}
        role="button"
        tabIndex={0}
        aria-expanded={visible}
      >
        <Github className="mr-5 shrink-0 text-[#d5137f]" style={{ fontSize: "1.375rem" }} />
        <h3 className="text-[1.375rem] font-semibold text-[var(--text-title)] md:flex-shrink-0">
          {data.title}
        </h3>
      </div>
      <Link
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex flex-1 items-center justify-center rounded-[0.375rem] bg-[var(--primary)] px-2.5 py-2 text-[var(--text)] no-underline md:mt-0 md:w-full"
      >
        <Github className="mr-5 shrink-0 text-[var(--text-title)] transition-colors duration-500 hover:text-[#d5137f]" style={{ fontSize: "2.5rem" }} />
        <span className="text-[0.875rem] font-normal">{data.message}</span>
      </Link>
    </div>
  );
}
