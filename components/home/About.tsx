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
      className="bg-white pt-[3.75rem] font-mono"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <div className="container-portfolio flex flex-col md:flex-row md:items-center md:justify-start">
        <div
          className={`relative w-full max-w-[25rem] shrink-0 transition-all duration-1000 ease-in md:mr-5 md:max-w-full md:w-[43.75rem] ${
            animate ? "translate-x-0 opacity-100" : "-translate-x-[62.5rem] opacity-100"
          }`}
        >
          <Image
            src="/dev.png"
            alt="Dan Garcia - Dev"
            width={400}
            height={400}
            className="h-auto w-full rounded-[0.375rem] object-cover"
          />
        </div>
        <div
          className={`px-4 py-8 transition-all duration-1000 ease-in md:px-0 md:py-0 ${
            animate ? "opacity-100" : "opacity-0"
          }`}
          style={{ padding: "1.875rem 0.9375rem" }}
        >
          <h2 className="mb-[1.875rem] font-medium text-[var(--text-title)] text-[1.4375rem] md:text-[2rem]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {title}
          </h2>
          {messages.map((msg) => (
            <p
              key={msg.slice(0, 30)}
              className="mb-[0.9375rem] text-[var(--text)] text-[0.8125rem] leading-6 md:text-[1rem] md:max-w-[43.75rem]"
            >
              {msg}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
