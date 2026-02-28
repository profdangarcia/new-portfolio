interface SectionTitleProps {
  title: string;
  description?: string;
}

export default function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <div className="flex w-full flex-col items-center pt-[3.125rem]">
      <h2 className="mb-5 text-center font-bold text-[var(--text-title)] text-[1.4375rem] md:text-[2rem]" style={{ fontFamily: "Montserrat, sans-serif" }}>
        {title}
      </h2>
      {description && (
        <p className="text-center text-[var(--text)] md:text-[1rem]">
          {description}
        </p>
      )}
    </div>
  );
}
