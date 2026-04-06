import type { ComponentPropsWithoutRef, ReactNode } from "react";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  tone?: "default" | "muted" | "accent";
};

const toneClasses = {
  default: "border-white/70 bg-white/78",
  muted: "border-line/70 bg-mist/88",
  accent: "border-accent/20 bg-accent-soft/65",
};

export function Card({
  children,
  className = "",
  tone = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={`panel-surface ${toneClasses[tone]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
