import type { InputHTMLAttributes } from "react";

type NumericFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  invalid?: boolean;
};

export function NumericField({
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  invalid = false,
  className = "",
  ...props
}: NumericFieldProps) {
  return (
    <div className="relative">
      {prefix ? (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink/45">
          {prefix}
        </span>
      ) : null}

      <input
        type="number"
        inputMode="decimal"
        enterKeyHint="done"
        value={Number.isNaN(value) ? "" : value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`w-full appearance-none rounded-[20px] border bg-white/92 py-3.5 text-base text-ink outline-none transition [font-variant-numeric:tabular-nums] placeholder:text-ink/30 focus:ring-4 ${
          invalid
            ? "border-[#d08a78] focus:border-[#c06f57] focus:ring-[#c06f57]/10"
            : "border-line focus:border-accent/35 focus:ring-accent/10"
        } ${
          prefix ? "pl-9" : "pl-4"
        } ${suffix ? "pr-14" : "pr-4"} ${className}`.trim()}
        {...props}
      />

      {suffix ? (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink/45">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
