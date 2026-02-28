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
      className="w-full bg-white pt-[3.75rem]"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="flex flex-col justify-center md:flex-row md:items-center md:justify-start">
        <div
          className="h-auto w-full max-w-[25rem] shrink-0 overflow-hidden rounded-[0.375rem] transition-[transform] duration-1000 ease-in lg:mr-5 lg:max-w-full lg:w-[43.75rem]"
          style={{
            transform: animate ? "translateX(0)" : "translateX(-1000px)",
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
          className="px-[0.9375rem] py-[1.875rem] transition-opacity duration-1000 ease-in"
          style={{ opacity: animate ? 1 : 0 }}
        >
          <h2 className="mb-[1.875rem] font-medium text-[#333] text-[1.4375rem] lg:text-[2rem]">
            {title}
          </h2>
          <div className="lg:max-w-[43.75rem]">
            {messages.map((msg) => (
              <p
                key={msg.slice(0, 30)}
                className="mb-[0.9375rem] text-[#777] text-[0.8125rem] leading-6 lg:text-[1rem]"
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
