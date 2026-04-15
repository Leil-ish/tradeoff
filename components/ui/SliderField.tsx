type SliderFieldProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  valueLabel?: string;
  minLabel?: string;
  maxLabel?: string;
};

export function SliderField({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  valueLabel,
  minLabel,
  maxLabel,
}: SliderFieldProps) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      {label || valueLabel ? (
        <div className="flex items-center justify-between gap-3">
          {label ? <span className="text-sm text-ink/65">{label}</span> : <span />}
          {valueLabel ? (
            <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-deep">
              {valueLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="slider-thumb h-3 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent touch-pan-x"
        style={{
          background: `linear-gradient(to right, #2f5d8c 0%, #2f5d8c ${progress}%, #cad5e1 ${progress}%, #cad5e1 100%)`,
        }}
      />

      {minLabel || maxLabel ? (
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-ink/42">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
