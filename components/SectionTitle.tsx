interface SectionTitleProps {
  title: string;
  description?: string;
}

export default function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <div className="mb-10 text-center md:mb-14">
      <h2 className="font-display text-2xl font-bold tracking-widest text-[var(--text-title)] md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl mx-auto text-[var(--text)] text-sm md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
