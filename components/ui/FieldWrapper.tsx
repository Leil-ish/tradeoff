import type { ReactNode } from "react";

type FieldWrapperProps = {
  label: string;
  hint?: string;
  error?: string;
  optionalNote?: string;
  children: ReactNode;
};

export function FieldWrapper({
  label,
  hint,
  error,
  optionalNote,
  children,
}: FieldWrapperProps) {
  return (
    <label className="flex flex-col gap-3">
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-sm font-semibold text-ink">{label}</span>
          {optionalNote ? (
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink/40">
              {optionalNote}
            </span>
          ) : null}
        </div>
        {hint ? <p className="text-sm leading-6 text-ink/62">{hint}</p> : null}
        {error ? <p className="text-sm leading-6 text-[#9b4a36]">{error}</p> : null}
      </div>
      {children}
    </label>
  );
}
