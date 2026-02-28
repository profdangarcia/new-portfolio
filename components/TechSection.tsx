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
    <section className="bg-[var(--background)] py-16 md:py-24">
      <div className="container-portfolio">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {techs.map((tech) => {
            const Icon = iconMap[tech.icon as keyof typeof iconMap] ?? Monitor;
            return (
              <div
                key={tech.title}
                className="flex flex-col items-center gap-4 rounded-lg border border-[var(--text)]/10 bg-white p-6 text-center shadow-sm dark:border-[var(--text)]/20 dark:bg-[var(--background)]"
              >
                <Icon className="size-12 text-[var(--text-title)]" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-bold tracking-wider text-[var(--text-title)]">
                  {tech.title}
                </h3>
                <p className="text-sm text-[var(--text)] leading-relaxed">
                  {tech.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
