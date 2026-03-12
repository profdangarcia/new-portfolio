interface SectionTitleProps {
  title: string;
  description?: string;
  variant?: "default" | "light";
}

export default function SectionTitle({ title, description, variant = "default" }: SectionTitleProps) {
  const titleClass = variant === "light"
    ? "mb-5 text-center font-bold text-[var(--text-title)] text-xl md:text-2xl"
    : "mb-5 text-center font-bold text-[var(--text-title)] text-xl md:text-2xl";
  const descClass = "text-center text-[var(--text)] md:text-base";

  return (
    <div className="flex w-full flex-col items-center pt-10">
      <h2 className={titleClass} style={{ fontFamily: "Montserrat, sans-serif" }}>
        {title}
      </h2>
      {description && <p className={descClass}>{description}</p>}
    </div>
  );
}
