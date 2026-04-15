import { PriorityAllocator } from "@/components/PriorityAllocator";
import { FieldWrapper } from "@/components/ui/FieldWrapper";
import { NumericField } from "@/components/ui/NumericField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
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

      <div className="grid gap-4 rounded-[24px] border border-line/70 bg-white/58 p-4 sm:grid-cols-2 sm:p-5">
        <FieldWrapper
          label="How often does this happen?"
          hint="Recurring tasks justify more setup than one-off tasks."
        >
          <SegmentedControl
            value={value.frequency}
            onChange={(nextValue) => onChange("frequency", nextValue)}
            options={[
              { value: "one-time", label: "One-time" },
              { value: "occasional", label: "Occasional" },
              { value: "recurring", label: "Recurring" },
            ]}
          />
        </FieldWrapper>

        <FieldWrapper
          label="How annoying is it to hand this off?"
          hint="Think setup, access, texting, follow-up, and admin spillover."
        >
          <SegmentedControl
            value={value.handoffFriction}
            onChange={(nextValue) => onChange("handoffFriction", nextValue)}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        </FieldWrapper>
      </div>

      <div className="grid gap-4 rounded-[24px] border border-line/70 bg-white/58 p-4 sm:grid-cols-2 sm:p-5">
        <FieldWrapper
          label="Trust, privacy, or access barrier"
          hint="For example: letting someone into your home or handing over account access."
        >
          <SegmentedControl
            value={value.trustBarrier}
            onChange={(nextValue) => onChange("trustBarrier", nextValue)}
            options={[
              { value: "none", label: "None" },
              { value: "some", label: "Some" },
              { value: "high", label: "High" },
            ]}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Quality mismatch risk"
          hint="How likely is it that you would still end up correcting or redoing part of it?"
        >
          <SegmentedControl
            value={value.qualityRisk}
            onChange={(nextValue) => onChange("qualityRisk", nextValue)}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        </FieldWrapper>
      </div>

      <div className="grid gap-4 rounded-[24px] border border-line/70 bg-white/58 p-4 sm:grid-cols-2 sm:p-5">
        <FieldWrapper
          label="How much personal value does doing it yourself have?"
          hint="Treat active recovery and satisfaction as valid value, not just a cost."
        >
          <SegmentedControl
            value={value.personalValue}
            onChange={(nextValue) => onChange("personalValue", nextValue)}
            options={[
              { value: "hate-it", label: "Hate it" },
              { value: "neutral", label: "Neutral" },
              { value: "enjoy-it", label: "Enjoy it" },
              { value: "would-miss-it", label: "Would miss it" },
            ]}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Would the time back be meaningfully usable?"
          hint="Saved time only matters if it turns into real capacity."
        >
          <SegmentedControl
            value={value.timeUsefulness}
            onChange={(nextValue) => onChange("timeUsefulness", nextValue)}
            options={[
              { value: "not-really", label: "Not really" },
              { value: "somewhat", label: "Somewhat" },
              { value: "yes", label: "Yes" },
            ]}
          />
        </FieldWrapper>
      </div>

      <div className="grid gap-4 rounded-[24px] border border-line/70 bg-white/58 p-4 sm:grid-cols-2 sm:p-5">
        <FieldWrapper
          label="Is paying for this realistic right now?"
          hint="Separate worth it from what your budget can comfortably absorb."
        >
          <SegmentedControl
            value={value.budgetReality}
            onChange={(nextValue) => onChange("budgetReality", nextValue)}
            options={[
              { value: "easy", label: "Easy" },
              { value: "stretch", label: "Stretch" },
              { value: "not-realistic", label: "Not realistic" },
            ]}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Could part of this be handed off?"
          hint="Some tasks work better when only the worst part is outsourced."
        >
          <SegmentedControl
            value={value.splitPotential}
            onChange={(nextValue) => onChange("splitPotential", nextValue)}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
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
