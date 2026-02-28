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
    <article className="group relative m-[1.5625rem] flex h-auto w-[26.25rem] max-w-full flex-col rounded-[0.375rem] bg-[#f5f5f5] md:h-[15.625rem] md:w-[26.25rem]">
      <div className="relative left-0 top-0 z-[1] flex h-[9.375rem] w-full shrink-0 items-center justify-center overflow-hidden rounded-t-[0.375rem] border-2 border-[#f5f5f5] bg-[#f5f5f5] transition-[width,height,left,top] duration-500 ease-in-out group-hover:h-[12.5rem] md:absolute md:h-full md:w-full md:rounded-[0.375rem] md:group-hover:h-[9.375rem] md:group-hover:w-[9.375rem] md:group-hover:left-[-4.6875rem] md:group-hover:top-[calc(50%-4.6875rem)]">
        <Image
          src={cardData.picture}
          alt={cardData.title}
          fill
          className={`object-cover transition-all duration-500 ease-in-out ${
            cardData.available === false ? "grayscale" : "grayscale-0"
          }`}
          sizes="420px"
        />
      </div>
      {cardData.openSource && cardData.repoUrl && (
        <div
          className="absolute right-0 top-[0.9375rem] z-[2] flex h-[1.875rem] w-[7.5rem] items-center justify-end bg-[#d5137f] pr-2.5 font-bold transition-colors duration-200 hover:bg-[#b00765]"
          style={{
            clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 4% 50%)",
          }}
        >
          <a
            href={cardData.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white no-underline"
          >
            Open Source
          </a>
        </div>
      )}
      <div className="relative flex w-full flex-1 items-center justify-center p-5 transition-all duration-500 ease-in-out md:absolute md:right-0 md:top-0 md:h-full md:w-[calc(100%-4.6875rem)]">
        <div>
          <h3 className="mb-[0.3125rem] text-[1rem] text-[#333]">
            {cardData.title}
          </h3>
          <p className="text-[0.75rem] text-[#777]">
            {cardData.description}
          </p>
          {cardData.available && (
            <a
              href={cardData.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-block rounded-[0.375rem] bg-[#333] px-[0.9375rem] py-2.5 font-semibold text-white no-underline transition-all duration-500 ease-in-out hover:bg-[#777]"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
