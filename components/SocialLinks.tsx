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
  const linkClass = isBanner
    ? "text-white"
    : "text-[var(--footer-text)] hover:text-white";
  return (
    <div className={`flex gap-6 md:gap-8 ${isBanner ? "text-white" : ""}`}>
      {LINKS.map(({ href, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`focus-ring text-base transition-opacity hover:opacity-80 md:text-2xl [&_svg]:size-6 md:[&_svg]:size-8 ${!isBanner ? linkClass : ""}`}
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
          className={`focus-ring text-base transition-opacity hover:opacity-80 md:text-2xl [&_svg]:size-6 md:[&_svg]:size-8 ${linkClass}`}
          aria-label="WhatsApp"
        >
          <MessageCircle />
        </a>
      )}
    </div>
  );
}
