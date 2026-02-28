interface SectionTitleProps {
  title: string;
  description?: string;
  variant?: "default" | "light";
}

export default function SectionTitle({ title, description, variant = "default" }: SectionTitleProps) {
  const titleClass = variant === "light"
    ? "mb-5 text-center font-bold text-[#333] text-[1.4375rem] md:text-[2rem]"
    : "mb-5 text-center font-bold text-[var(--text-title)] text-[1.4375rem] md:text-[2rem]";
  const descClass = variant === "light"
    ? "text-center text-[#777] md:text-[1rem]"
    : "text-center text-[var(--text)] md:text-[1rem]";

  return (
    <div className="flex w-full flex-col items-center pt-[3.125rem]">
      <h2 className={titleClass} style={{ fontFamily: "Montserrat, sans-serif" }}>
        {title}
      </h2>
      {description && <p className={descClass}>{description}</p>}
    </div>
  );
}
