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
      className="tip-box absolute z-[9] flex flex-col bg-[#f5f5f5]"
      style={
        {
          ["--tip-bottom" as string]: visible ? 0 : -200,
          ["--tip-right" as string]: visible ? 0 : -250,
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
            <CircleArrowDown className="text-[#d5137f]" size={22} />
          ) : (
            <CircleArrowUp className="text-[#d5137f]" size={22} />
          )}
        </span>
        <h3 className="text-[1.375rem] font-semibold text-[#333] md:shrink-0">
          {data.title}
        </h3>
      </div>

      <Link
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex flex-1 items-center justify-center rounded-[0.375rem] bg-white px-2.5 py-0 text-[#777] no-underline md:mt-0 md:w-full"
        style={{ minHeight: "60%" }}
      >
        <Github
          className="mr-5 shrink-0 text-[#333] transition-colors duration-500 ease-in-out hover:text-[#d5137f]"
          size={40}
        />
        <span className="text-[0.875rem] font-normal">{data.message}</span>
      </Link>
    </div>
  );
}
