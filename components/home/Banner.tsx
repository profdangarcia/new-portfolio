"use client";

import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { ChevronDown } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";

interface BannerProps {
  lines: readonly string[];
}

export default function Banner({ lines }: BannerProps) {
  const steps: (string | number)[] = [];
  lines.forEach((line, i) => {
    steps.push(line, i === 0 ? 3000 : 1500);
  });
  steps.push(lines[0], 3000);

  return (
    <section
      id="banner"
      className="relative flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white"
    >
      {/* LCP background image – high priority for faster hero paint */}
      <Image
        src="/banner-bg.png"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="pointer-events-none select-none object-cover"
      />
      {/* Overlay gradient for readability and modern look */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <div
          className="mb-5 text-center font-mono text-[2rem] font-bold md:mb-6 md:text-[4.6875rem]"
          style={{
            fontFamily: "Montserrat, serif",
            textShadow: "0 0.125rem 0.75rem rgba(0,0,0,0.5), 0 0 2.5rem rgba(0,0,0,0.3)",
          }}
        >
          <TypeAnimation
            key={lines.join("|")}
            sequence={steps}
            wrapper="p"
            repeat={Infinity}
            cursor={true}
          />
        </div>
        <SocialLinks isBanner />
        <a
          href="#about"
          className="btn-interact focus-ring mt-24 flex h-20 items-end rounded-full border-2 border-white/60 bg-white/5 px-4 pb-2 text-2xl text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10 md:mt-32 md:text-3xl"
          aria-label="Scroll to about"
        >
          <ChevronDown className="animate-bounce" style={{ fontSize: "inherit" }} />
        </a>
      </div>
    </section>
  );
}
