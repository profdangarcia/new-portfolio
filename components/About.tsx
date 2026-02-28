"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface AboutProps {
  title: string;
  messages: readonly string[];
}

export default function About({ title, messages }: AboutProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined" && window.pageYOffset >= 200 && !animate) {
        setAnimate(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animate]);

  return (
    <section
      id="about"
      className="bg-[var(--background)] py-16 md:py-24"
    >
      <div className="container-portfolio flex flex-col items-center gap-10 md:flex-row md:gap-16">
        <div
          className={`relative shrink-0 transition-all duration-700 ${
            animate ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-60"
          }`}
        >
          <Image
            src="/dev.png"
            alt="Dan Garcia - Dev"
            width={280}
            height={280}
            className="rounded-lg object-cover shadow-lg md:w-80 md:h-80"
          />
        </div>
        <div
          className={`flex flex-col gap-4 transition-all duration-700 delay-150 ${
            animate ? "translate-x-0 opacity-100" : "translate-x-8 opacity-60"
          }`}
        >
          <h2 className="font-display text-2xl font-bold tracking-widest text-[var(--text-title)] md:text-3xl">
            {title}
          </h2>
          {messages.map((msg) => (
            <p
              key={msg.slice(0, 30)}
              className="text-[var(--text)] leading-relaxed"
            >
              {msg}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
