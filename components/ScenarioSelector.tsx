import { PRESET_OPTIONS } from "@/lib/constants";
import type { PresetId } from "@/lib/types";

type ScenarioSelectorProps = {
  activePreset: PresetId;
  onSelect: (presetId: PresetId) => void;
};

export function ScenarioSelector({
  activePreset,
  onSelect,
}: ScenarioSelectorProps) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {PRESET_OPTIONS.map((option) => {
        const isActive = option.id === activePreset;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`rounded-[22px] border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-4 ${
              isActive
                ? "border-accent/25 bg-accent-soft/85 shadow-soft focus-visible:ring-accent/20"
                : "border-line bg-white/60 hover:bg-white/85 focus-visible:ring-ink/10"
            }`}
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">{option.label}</p>
              <p className="text-sm leading-6 text-ink/63">{option.summary}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
