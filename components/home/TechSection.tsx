import {
  Monitor,
  Code2,
  Server,
  Layers,
} from "lucide-react";

interface Tech {
  title: string;
  description: string;
  icon: string;
}

interface TechSectionProps {
  techs: readonly Tech[];
}

const iconMap = {
  monitor: Monitor,
  react: Code2,
  node: Server,
  next: Layers,
} as const;

/**
 * Replicado do my-portfolio: fundo cinza claro (#f5f5f5), texto escuro (#333 / #777),
 * padding 45px 0, flex row em 1024px com space-between, itens altura 180px, título 13px/15px, descrição 13px/15px.
 */
export default function TechSection({ techs }: TechSectionProps) {
  return (
    <section className="bg-[#f5f5f5] py-[2.8125rem]">
      <div className="container-portfolio">
        <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between">
          {techs.map((tech) => {
            const Icon = iconMap[tech.icon as keyof typeof iconMap] ?? Monitor;
            return (
              <div
                key={tech.title}
                className="flex flex-col items-center justify-center py-5 text-center lg:h-[11.25rem] lg:justify-between lg:py-0"
              >
                <Icon
                  className="size-[2.8125rem] shrink-0 text-[#333]"
                  strokeWidth={1.5}
                />
                <div className="lg:h-[9.375rem]">
                  <h3
                    className="my-[0.9375rem] font-normal tracking-[0.0625rem] text-[#333] text-[0.8125rem] lg:text-[0.9375rem]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {tech.title}
                  </h3>
                  <p className="max-w-[25rem] text-[#777] text-[0.8125rem] leading-5 lg:max-w-[14.375rem] lg:text-[0.9375rem]">
                    {tech.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
