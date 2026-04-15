import { PRIORITY_OPTIONS } from "@/lib/form-types";
import type { PriorityAllocation, PriorityCategory } from "@/lib/form-types";

type PriorityAllocatorProps = {
  value: PriorityAllocation;
  onChange: (nextValue: PriorityAllocation) => void;
  totalHours?: number;
  error?: string;
};

export function PriorityAllocator({
  value,
  onChange,
  totalHours = 5,
  error,
}: PriorityAllocatorProps) {
  const allocated = PRIORITY_OPTIONS.reduce(
    (sum, category) => sum + value[category],
    0,
  );
  const remaining = totalHours - allocated;

  const applyDistribution = (distribution: number[]) => {
    const nextValue = PRIORITY_OPTIONS.reduce((accumulator, category, index) => {
      accumulator[category] = distribution[index] ?? 0;
      return accumulator;
    }, {} as PriorityAllocation);

    onChange(nextValue);
  };

  const setHours = (category: PriorityCategory, nextHours: number) => {
    onChange({
      ...value,
      [category]: nextHours,
    });
  };

  return (
    <div className="space-y-4 rounded-[24px] border border-line bg-white/78 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Allocate 5 reclaimed hours</p>
          <p className="text-sm leading-6 text-ink/62">
            Spread your hours across the kinds of time you most want back. Most
            people only need to pick two or three categories.
          </p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            remaining === 0
              ? "bg-accent-soft text-accent-deep"
              : "bg-sand text-ink/75"
          }`}
        >
          {remaining === 0 ? "5 of 5 assigned" : `${remaining} hour${remaining === 1 ? "" : "s"} left`}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyDistribution([1, 1, 1, 1, 0, 0, 1, 0])}
          className="rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold text-ink/75 transition hover:bg-mist"
        >
          Use balanced split
        </button>
        <button
          type="button"
          onClick={() => applyDistribution([0, 0, 0, 0, 0, 0, 0, 0])}
          className="rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold text-ink/75 transition hover:bg-mist"
        >
          Clear hours
        </button>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-sand">
        <div
          className={`h-full rounded-full transition-all duration-200 ${
            remaining === 0 ? "bg-accent" : "bg-[#78a98e]"
          }`}
          style={{ width: `${Math.min((allocated / totalHours) * 100, 100)}%` }}
        />
      </div>

      {error ? <p className="text-sm leading-6 text-[#9b4a36]">{error}</p> : null}

      <div className="space-y-3">
        {PRIORITY_OPTIONS.map((category) => {
          const currentValue = value[category];
          const maxSelectable = currentValue + Math.max(remaining, 0);

          return (
            <div
              key={category}
              className="rounded-[20px] border border-line/80 bg-mist/65 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{category}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-ink/42">
                    {currentValue}h allocated
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHours(category, Math.max(0, currentValue - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-lg text-ink transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={currentValue === 0}
                    aria-label={`Decrease hours for ${category}`}
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-ink">
                    {currentValue}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setHours(category, Math.min(totalHours, currentValue + 1))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-lg text-ink transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={currentValue >= maxSelectable || allocated >= totalHours}
                    aria-label={`Increase hours for ${category}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
