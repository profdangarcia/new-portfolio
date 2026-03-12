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
    <section className="bg-[var(--background)] py-12">
      <div className="container-portfolio">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {techs.map((tech) => {
            const Icon = iconMap[tech.icon as keyof typeof iconMap] ?? Monitor;
            return (
              <div
                key={tech.title}
                className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-md)]"
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-[var(--primary-light)]">
                  <Icon
                    className="size-8 text-[var(--primary)]"
                    strokeWidth={1.5}
                  />
                </div>
                <h3
                  className="mb-2 font-semibold tracking-wide text-[var(--text-title)] text-sm lg:text-base"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {tech.title}
                </h3>
                <p className="max-w-[18rem] text-[var(--text)] text-sm leading-relaxed">
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
