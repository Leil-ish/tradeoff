import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const variantClasses = {
  primary:
    "bg-accent text-white hover:bg-accent-deep focus-visible:ring-accent/35",
  secondary:
    "bg-white/85 text-ink ring-1 ring-inset ring-line hover:bg-white focus-visible:ring-ink/15",
  ghost:
    "bg-transparent text-ink hover:bg-white/60 focus-visible:ring-ink/10",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
