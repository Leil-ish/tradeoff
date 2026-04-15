import type { ReactNode } from "react";

type SegmentOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-h-[4.75rem] min-w-[8.5rem] flex-1 rounded-[24px] border px-4 py-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-4 ${
              isActive
                ? "border-accent/30 bg-accent-deep text-white shadow-soft focus-visible:ring-accent/25"
                : "border-line bg-white/76 text-ink hover:border-accent/25 hover:bg-[#fff8f4] focus-visible:ring-ink/10"
            }`}
          >
            <div className="flex h-full items-center gap-3">
              {option.icon ? (
                <span
                  className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                    isActive ? "bg-white/14" : "bg-accent-soft/70 text-accent-deep"
                  }`}
                >
                  {option.icon}
                </span>
              ) : null}
              <div className="min-w-0 space-y-1">
                <div className="text-sm font-semibold leading-5">{option.label}</div>
                {option.description ? (
                  <p
                    className={`text-sm leading-6 ${
                      isActive ? "text-white/78" : "text-ink/68"
                    }`}
                  >
                    {option.description}
                  </p>
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
