import { PriorityAllocator } from "@/components/PriorityAllocator";
import { FieldWrapper } from "@/components/ui/FieldWrapper";
import { NumericField } from "@/components/ui/NumericField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SliderField } from "@/components/ui/SliderField";
import type { OutsourceFormState } from "@/lib/form-types";
import { getNumericError } from "@/lib/validation";

type OutsourceFormProps = {
  value: OutsourceFormState;
  priorityError?: string;
  onChange: <K extends keyof OutsourceFormState>(
    key: K,
    value: OutsourceFormState[K],
  ) => void;
};

export function OutsourceForm({
  value,
  priorityError,
  onChange,
}: OutsourceFormProps) {
  const diyHoursError = getNumericError(value.diyHours, "DIY time");
  const outsourceCostError = getNumericError(
    value.outsourceCost,
    "Outsource cost",
  );
  const hourlyValueError = getNumericError(value.hourlyTimeValue, "Hourly value");

  return (
    <>
      <div className="grid gap-4 rounded-[24px] border border-line/70 bg-white/58 p-4 sm:grid-cols-2 sm:p-5">
        <FieldWrapper
          label="Estimated time to do it yourself"
          hint="Use your own real-world estimate, not the ideal version."
          error={diyHoursError}
        >
          <NumericField
            min={0}
            step={0.25}
            placeholder="2.5"
            value={value.diyHours}
            onChange={(nextValue) => onChange("diyHours", nextValue)}
            suffix="hrs"
            invalid={Boolean(diyHoursError)}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Cost to outsource"
          hint="Include the realistic all-in price you would pay."
          error={outsourceCostError}
        >
          <NumericField
            min={0}
            step={1}
            placeholder="120"
            value={value.outsourceCost}
            onChange={(nextValue) => onChange("outsourceCost", nextValue)}
            prefix="$"
            invalid={Boolean(outsourceCostError)}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="Professional efficiency"
        hint="How much faster a professional would likely be than you."
        optionalNote="1x to 5x"
      >
        <SliderField
          min={1}
          max={5}
          step={0.5}
          value={value.efficiencyMultiplier}
          onChange={(nextValue) => onChange("efficiencyMultiplier", nextValue)}
          valueLabel={`${value.efficiencyMultiplier}x`}
          minLabel="same pace"
          maxLabel="much faster"
        />
      </FieldWrapper>

      <div className="grid gap-4 rounded-[24px] border border-line/70 bg-white/58 p-4 sm:grid-cols-2 sm:p-5">
        <FieldWrapper
          label="Coordination friction"
          hint="Scheduling, texting, managing access, follow-up."
        >
          <SegmentedControl
            value={value.coordinationFriction}
            onChange={(nextValue) => onChange("coordinationFriction", nextValue)}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Would you miss doing it?"
          hint="This captures whether the task holds some personal value."
        >
          <SegmentedControl
            value={value.missDoingIt}
            onChange={(nextValue) => onChange("missDoingIt", nextValue)}
            options={[
              { value: "hate-it", label: "Hate it" },
              { value: "neutral", label: "Neutral" },
              { value: "would-miss-it", label: "Would miss it" },
            ]}
          />
        </FieldWrapper>
      </div>

      <div className="grid gap-4 rounded-[24px] border border-line/70 bg-white/58 p-4 sm:grid-cols-2 sm:p-5">
        <FieldWrapper
          label="Identity relevance"
          hint="Does doing this yourself feel important to who you are?"
        >
          <SegmentedControl
            value={value.identityRelevance}
            onChange={(nextValue) => onChange("identityRelevance", nextValue)}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Hourly time value"
          hint="A practical estimate of what one hour of your time is worth."
          error={hourlyValueError}
        >
          <NumericField
            min={0}
            step={1}
            placeholder="50"
            value={value.hourlyTimeValue}
            onChange={(nextValue) => onChange("hourlyTimeValue", nextValue)}
            prefix="$"
            suffix="/hr"
            invalid={Boolean(hourlyValueError)}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="Where do you most want more time?"
        hint="Allocate exactly 5 hours. This later shapes the opportunity-cost language in the result."
      >
        <PriorityAllocator
          value={value.priorities}
          onChange={(nextValue) => onChange("priorities", nextValue)}
          error={priorityError}
        />
      </FieldWrapper>
    </>
  );
}
