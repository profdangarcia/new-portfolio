"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface AboutProps {
  title: string;
  messages: readonly string[];
}

export default function About({ title, messages }: AboutProps) {
  const [animate, setAnimate] = useState(false);

  const handleScroll = useCallback(() => {
    if (typeof window !== "undefined" && window.pageYOffset >= 200 && !animate) {
      setAnimate(true);
    }
  }, [animate]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section
      id="about"
      className="w-full bg-[var(--surface)] pt-12"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="flex flex-col justify-center md:flex-row md:items-center md:justify-start md:gap-8">
        <div
          className="h-auto w-full max-w-[25rem] shrink-0 overflow-hidden rounded-xl transition-[transform] duration-1000 ease-out lg:max-w-full lg:w-[43.75rem]"
          style={{
            transform: animate ? "translateX(0)" : "translateX(-62.5rem)",
          }}
        >
          <Image
            src="/dev.png"
            alt="Dan Garcia - Dev"
            width={700}
            height={700}
            className="h-auto w-full object-cover"
          />
        </div>

        <div
          className="px-4 py-8 transition-opacity duration-1000 ease-out md:py-12"
          style={{ opacity: animate ? 1 : 0 }}
        >
          <h2 className="mb-6 font-semibold text-[var(--text-title)] text-xl lg:text-2xl">
            {title}
          </h2>
          <div className="lg:max-w-[43.75rem]">
            {messages.map((msg) => (
              <p
                key={msg.slice(0, 30)}
                className="mb-4 text-[var(--text)] text-sm leading-relaxed lg:text-base"
              >
                {msg}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
