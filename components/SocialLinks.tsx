"use client";

import Link from "next/link";
import {
  Linkedin,
  Github,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";

const LINKS = [
  { href: "https://www.linkedin.com/in/profdangarcia/", Icon: Linkedin },
  { href: "https://github.com/profdangarcia", Icon: Github },
  { href: "https://www.facebook.com/devDanGarcia", Icon: Facebook },
  { href: "https://www.instagram.com/prof_dangarcia/", Icon: Instagram },
] as const;

const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=5535992017139&text=Daniel!%20Vi%20seu%20portf%C3%B3lio...%20vamos%20tomar%20um%20caf%C3%A9%3F";

interface SocialLinksProps {
  isBanner?: boolean;
}

export default function SocialLinks({ isBanner = true }: SocialLinksProps) {
  return (
    <div className="flex gap-6 text-white md:gap-8">
      {LINKS.map(({ href, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base transition-opacity hover:opacity-70 md:text-2xl [&_svg]:size-6 md:[&_svg]:size-8"
          aria-label={href}
        >
          <Icon />
        </a>
      ))}
      {!isBanner && (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base transition-opacity hover:opacity-70 md:text-2xl [&_svg]:size-6 md:[&_svg]:size-8"
          aria-label="WhatsApp"
        >
          <MessageCircle />
        </a>
      )}
    </div>
  );
}
