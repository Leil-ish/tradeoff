import { PriorityAllocator } from "@/components/PriorityAllocator";
import { FieldWrapper } from "@/components/ui/FieldWrapper";
import { NumericField } from "@/components/ui/NumericField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { DealSearchFormState } from "@/lib/form-types";
import { getNumericError } from "@/lib/validation";

type DealSearchFormProps = {
  value: DealSearchFormState;
  priorityError?: string;
  onChange: <K extends keyof DealSearchFormState>(
    key: K,
    value: DealSearchFormState[K],
  ) => void;
};

export function DealSearchForm({
  value,
  priorityError,
  onChange,
}: DealSearchFormProps) {
  const productPriceError = getNumericError(value.productPrice, "Product price");
  const likelySavingsError = getNumericError(
    value.likelySavings,
    "Likely savings",
  );
  const searchHoursError = getNumericError(value.searchHours, "Search time");
  const hourlyValueError = getNumericError(value.hourlyTimeValue, "Hourly value");

  return (
    <>
      <div className="grid gap-4 rounded-[24px] border border-line/70 bg-white/58 p-4 sm:grid-cols-2 sm:p-5">
        <FieldWrapper
          label="Product price"
          hint="Use the current price you would pay if you stopped searching now."
          error={productPriceError}
        >
          <NumericField
            min={0}
            step={1}
            placeholder="240"
            value={value.productPrice}
            onChange={(nextValue) => onChange("productPrice", nextValue)}
            prefix="$"
            invalid={Boolean(productPriceError)}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Likely additional savings"
          hint="What you realistically think more searching might save."
          error={likelySavingsError}
        >
          <NumericField
            min={0}
            step={1}
            placeholder="25"
            value={value.likelySavings}
            onChange={(nextValue) => onChange("likelySavings", nextValue)}
            prefix="$"
            invalid={Boolean(likelySavingsError)}
          />
        </FieldWrapper>
      </div>

      <div className="grid gap-4 rounded-[24px] border border-line/70 bg-white/58 p-4 sm:grid-cols-2 sm:p-5">
        <FieldWrapper
          label="Additional search time"
          hint="How much more time you expect to spend looking."
          error={searchHoursError}
        >
          <NumericField
            min={0}
            step={0.25}
            placeholder="0.5"
            value={value.searchHours}
            onChange={(nextValue) => onChange("searchHours", nextValue)}
            suffix="hrs"
            invalid={Boolean(searchHoursError)}
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

      <div className="grid gap-4 rounded-[24px] border border-line/70 bg-white/58 p-4 sm:grid-cols-2 sm:p-5">
        <FieldWrapper
          label="Urgency"
          hint="How costly it feels to delay the purchase."
        >
          <SegmentedControl
            value={value.urgency}
            onChange={(nextValue) => onChange("urgency", nextValue)}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Do you enjoy deal hunting?"
          hint="Enjoyment matters a little, but it should not overpower time cost."
        >
          <SegmentedControl
            value={value.dealEnjoyment}
            onChange={(nextValue) => onChange("dealEnjoyment", nextValue)}
            options={[
              { value: "hate-it", label: "Hate it" },
              { value: "neutral", label: "Neutral" },
              { value: "enjoy-it", label: "Enjoy it" },
            ]}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="Where do you most want more time?"
        hint="Allocate exactly 5 hours. This later shapes what continued searching is trading away."
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
