"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, CircleArrowUp, CircleArrowDown } from "lucide-react";

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
      className="tip-box absolute z-[9] flex flex-col rounded-t-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]"
      style={
        {
          ["--tip-bottom" as string]: visible ? 0 : -12.5,
          ["--tip-right" as string]: visible ? 0 : -15.625,
        } as React.CSSProperties
      }
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div
        className="flex h-[3.125rem] shrink-0 cursor-pointer items-center justify-center md:ml-[-5.3125rem] md:mr-[-4.0625rem] md:rotate-[-90deg]"
        onClick={() => setVisible((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setVisible((v) => !v)}
        role="button"
        tabIndex={0}
        aria-expanded={visible}
      >
        <span className="tip-box-bouncing tip-box-bouncing-short mr-5 shrink-0">
          {visible ? (
            <CircleArrowDown className="text-[var(--primary)]" size={22} />
          ) : (
            <CircleArrowUp className="text-[var(--primary)]" size={22} />
          )}
        </span>
        <h3 className="text-[1.375rem] font-semibold text-[var(--text-title)] md:shrink-0">
          {data.title}
        </h3>
      </div>

      <Link
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring mt-4 flex flex-1 items-center justify-center rounded-lg bg-[var(--background)] px-2.5 py-0 text-[var(--text)] no-underline transition-colors hover:text-[var(--primary)] md:mt-0 md:w-full"
        style={{ minHeight: "60%" }}
      >
        <Github
          className="mr-5 shrink-0 text-[var(--text-title)] transition-colors duration-200 hover:text-[var(--primary)]"
          size={40}
        />
        <span className="text-[0.875rem] font-normal">{data.message}</span>
      </Link>
    </div>
  );
}
