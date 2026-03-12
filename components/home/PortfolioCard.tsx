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
    <article className="group relative m-4 flex max-w-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] sm:w-[20rem] md:w-[22rem]">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[var(--background)]">
        <Image
          src={cardData.picture}
          alt={cardData.title}
          fill
          className={`object-cover transition-all duration-300 group-hover:scale-105 ${
            cardData.available === false ? "grayscale" : "grayscale-0"
          }`}
          sizes="(max-width: 640px) 100vw, 22rem"
        />
        {cardData.openSource && cardData.repoUrl && (
          <span className="absolute right-3 top-3 rounded-md bg-[var(--primary)] px-2.5 py-1 text-xs font-semibold text-white shadow-md">
            <a
              href={cardData.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring text-white no-underline hover:opacity-90"
            >
              Open Source
            </a>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1.5 font-semibold text-[var(--text-title)]">
          {cardData.title}
        </h3>
        <p className="mb-4 flex-1 text-sm text-[var(--text)]">
          {cardData.description}
        </p>
        {cardData.available && (
          <a
            href={cardData.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interact focus-ring inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[var(--primary-hover)]"
          >
            {buttonText}
          </a>
        )}
      </div>
    </article>
  );
}
