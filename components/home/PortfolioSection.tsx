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

/**
 * Replicado do my-portfolio: fundo branco, título/descrição centralizados (50px top, 20px entre título e desc),
 * grid com justify-around / flex-wrap, padding-bottom 50px. Cards 420x250px, margin 25px, fundo #f5f5f5.
 */
export default function PortfolioSection({
  title,
  description,
  buttonText,
  projects,
  tip,
}: PortfolioSectionProps) {
  return (
    <section id="portfolio" className="relative overflow-hidden bg-white">
      <div className="container-portfolio">
        <SectionTitle title={title} description={description} variant="light" />
        <div className="flex flex-wrap justify-around pb-[3.125rem]">
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
