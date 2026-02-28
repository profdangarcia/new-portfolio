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

export default function TechSection({ techs }: TechSectionProps) {
  return (
    <section className="py-[2.8125rem]">
      <div className="container-portfolio">
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
          {techs.map((tech) => {
            const Icon = iconMap[tech.icon as keyof typeof iconMap] ?? Monitor;
            return (
              <div
                key={tech.title}
                className="flex flex-col items-center justify-center py-5 text-center text-[var(--text-title)] md:h-[11.25rem] md:justify-between md:py-0"
              >
                <Icon className="size-[2.8125rem] shrink-0 text-[var(--text-title)]" strokeWidth={1.5} />
                <div className="md:h-[9.375rem]">
                  <h3 className="my-4 font-normal tracking-[0.0625rem] text-[var(--text-title)] text-[0.8125rem] md:text-[0.9375rem]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {tech.title}
                  </h3>
                  <p className="max-w-[25rem] text-[var(--text)] text-[0.8125rem] leading-5 md:max-w-[14.375rem] md:text-[0.9375rem]">
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
