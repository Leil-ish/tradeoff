import type {
  DealSearchFormState,
  OutsourceFormState,
  PriorityAllocation,
} from "@/lib/form-types";

export type ReadinessCheck = {
  label: string;
  valid: boolean;
};

export type ResultReadiness = {
  isReady: boolean;
  missing: ReadinessCheck[];
};

export function countAllocatedPriorityHours(priorities: PriorityAllocation) {
  return Object.values(priorities).reduce((sum, hours) => sum + hours, 0);
}

export function isNonNegativeNumber(value: number) {
  return Number.isFinite(value) && value >= 0;
}

export function getNumericError(value: number, label: string) {
  if (!Number.isFinite(value)) {
    return `${label} needs a number.`;
  }

  if (value < 0) {
    return `${label} can't be negative.`;
  }

  return undefined;
}

export function getPriorityAllocationError(totalHours: number, targetHours = 5) {
  return totalHours === targetHours
    ? undefined
    : `Allocate exactly ${targetHours} hours. You currently have ${totalHours}.`;
}

export function getResultReadiness(
  formState: OutsourceFormState | DealSearchFormState,
  priorityHours: number,
): ResultReadiness {
  const sharedChecks: ReadinessCheck[] = [
    {
      label: "Allocate all 5 reclaimed hours across your priorities",
      valid: priorityHours === 5,
    },
  ];

  if (formState.mode === "outsource") {
    const hasCoreInputs =
      isNonNegativeNumber(formState.diyHours) &&
      isNonNegativeNumber(formState.outsourceCost);

    return {
      isReady: sharedChecks.every((item) => item.valid) && hasCoreInputs,
      missing: [
        ...sharedChecks,
        {
          label: "Add realistic time and cost inputs",
          valid: hasCoreInputs,
        },
      ],
    };
  }

  const hasCoreInputs =
    isNonNegativeNumber(formState.productPrice) &&
    isNonNegativeNumber(formState.likelySavings) &&
    isNonNegativeNumber(formState.searchHours) &&
    isNonNegativeNumber(formState.hourlyTimeValue);

  return {
    isReady: sharedChecks.every((item) => item.valid) && hasCoreInputs,
    missing: [
      ...sharedChecks,
      {
        label: "Add realistic price, savings, search time, and hourly value inputs",
        valid: hasCoreInputs,
      },
    ],
  };
}
