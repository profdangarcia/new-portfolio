import Image from "next/image";

export interface PortfolioCardProps {
  cardData: {
    title: string;
    description: string;
    picture: string;
    openSource: boolean;
    repoUrl?: string;
    websiteUrl: string;
    available?: boolean;
  };
  buttonText: string;
}

export default function PortfolioCard({ cardData, buttonText }: PortfolioCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-[var(--text)]/10 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-[var(--text)]/20 dark:bg-[var(--background)]">
      <div className="relative">
        <div className="relative aspect-video w-full overflow-hidden bg-[var(--text)]/5">
          <Image
            src={cardData.picture}
            alt={cardData.title}
            fill
            className={`object-cover ${cardData.available === false ? "opacity-60 grayscale" : ""}`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        {cardData.openSource && cardData.repoUrl && (
          <span className="absolute right-2 top-2 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
            <a
              href={cardData.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Open Source
            </a>
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-bold tracking-wide text-[var(--text-title)]">
          {cardData.title}
        </h3>
        <p className="text-sm text-[var(--text)] leading-relaxed">
          {cardData.description}
        </p>
        {cardData.available && (
          <a
            href={cardData.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-fit rounded-full bg-[var(--text-title)] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {buttonText}
          </a>
        )}
      </div>
    </article>
  );
}
