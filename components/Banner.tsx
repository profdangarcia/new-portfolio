"use client";

import { TypeAnimation } from "react-type-animation";
import { ChevronDown } from "lucide-react";
import SocialLinks from "./SocialLinks";

interface BannerProps {
  lines: readonly string[];
}

export default function Banner({ lines }: BannerProps) {
  const steps: (string | number)[] = [];
  lines.forEach((line, i) => {
    steps.push(line, i === 0 ? 3000 : 1500);
  });
  steps.push(lines[0], 3000); // restart first for loop feel

  return (
    <section
      id="banner"
      className="flex min-h-screen flex-col items-center justify-center bg-black bg-cover bg-center bg-no-repeat px-4 text-white"
      style={{ backgroundImage: "url('/banner-bg.png')" }}
    >
      <div className="mb-5 text-center font-mono text-2xl font-bold drop-shadow-md md:mb-6 md:text-5xl lg:text-6xl">
        <TypeAnimation
          sequence={steps}
          wrapper="p"
          repeat={Infinity}
          cursor={true}
          className="text-shadow"
        />
      </div>
      <SocialLinks isBanner />
      <a
        href="#about"
        className="mt-24 flex items-end text-white transition-opacity hover:opacity-80 md:mt-32 md:text-4xl"
        aria-label="Scroll to about"
      >
        <ChevronDown className="size-8 animate-bounce md:size-10" />
      </a>
    </section>
  );
}
