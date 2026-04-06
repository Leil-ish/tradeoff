type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left";

  return (
    <div className={`flex flex-col gap-2 ${alignment}`.trim()}>
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {eyebrow}
        </span>
      ) : null}
      <div className="space-y-2">
        <h2 className="font-display text-2xl leading-tight text-ink sm:text-[2rem]">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-7 text-ink/70 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
