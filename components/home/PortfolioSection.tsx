import SectionTitle from "./SectionTitle";
import PortfolioCard from "./PortfolioCard";
import TipBox from "./TipBox";

interface Project {
  title: string;
  description: string;
  picture: string;
  openSource: boolean;
  repoUrl?: string;
  websiteUrl: string;
  available?: boolean;
}

interface PortfolioSectionProps {
  title: string;
  description: string;
  buttonText: string;
  projects: readonly Project[];
  tip?: { title: string; message: string; url: string };
}

export default function PortfolioSection({
  title,
  description,
  buttonText,
  projects,
  tip,
}: PortfolioSectionProps) {
  return (
    <section id="portfolio" className="relative overflow-hidden bg-[var(--surface)]">
      <div className="container-portfolio">
        <SectionTitle title={title} description={description} variant="light" />
        <div className="flex flex-wrap justify-center gap-4 pb-12">
          {projects.map((project) => (
            <PortfolioCard
              key={project.title}
              cardData={project}
              buttonText={buttonText}
            />
          ))}
        </div>
      </div>
      {tip && <TipBox data={tip} />}
    </section>
  );
}
