import { PRIORITY_OPTIONS } from "@/lib/form-types";
import type {
  DealSearchFormState,
  OutsourceFormState,
  PriorityAllocation,
} from "@/lib/form-types";
import type { PresetId } from "@/lib/types";

const DEFAULT_PRIORITY_SPLIT: PriorityAllocation = {
  "Kids / family": 1,
  "Partner / relationships": 1,
  "Exercise / health": 1,
  "Rest / recovery": 1,
  "Work / earning": 0,
  "Friends / community": 0,
  "Hobbies / creativity": 1,
  "General life admin": 0,
};

const PRESET_PRIORITY_SPLITS: Record<PresetId, PriorityAllocation> = {
  "house-cleaning": {
    "Kids / family": 2,
    "Partner / relationships": 1,
    "Exercise / health": 1,
    "Rest / recovery": 1,
    "Work / earning": 0,
    "Friends / community": 0,
    "Hobbies / creativity": 0,
    "General life admin": 0,
  },
  "lawn-care": {
    "Kids / family": 1,
    "Partner / relationships": 1,
    "Exercise / health": 1,
    "Rest / recovery": 1,
    "Work / earning": 0,
    "Friends / community": 0,
    "Hobbies / creativity": 1,
    "General life admin": 0,
  },
  "grocery-delivery": {
    "Kids / family": 1,
    "Partner / relationships": 0,
    "Exercise / health": 1,
    "Rest / recovery": 1,
    "Work / earning": 1,
    "Friends / community": 0,
    "Hobbies / creativity": 0,
    "General life admin": 1,
  },
  laundry: {
    "Kids / family": 1,
    "Partner / relationships": 1,
    "Exercise / health": 0,
    "Rest / recovery": 1,
    "Work / earning": 0,
    "Friends / community": 0,
    "Hobbies / creativity": 1,
    "General life admin": 1,
  },
  "deal-shopping": {
    "Kids / family": 1,
    "Partner / relationships": 1,
    "Exercise / health": 0,
    "Rest / recovery": 1,
    "Work / earning": 1,
    "Friends / community": 0,
    "Hobbies / creativity": 1,
    "General life admin": 0,
  },
};

const OUTSOURCE_PRESETS: Record<PresetId, Omit<OutsourceFormState, "mode" | "presetId">> = {
  "house-cleaning": {
    diyHours: 3.5,
    outsourceCost: 160,
    efficiencyMultiplier: 3,
    coordinationFriction: "medium",
    missDoingIt: "hate-it",
    identityRelevance: "low",
    hourlyTimeValue: 55,
    priorities: PRESET_PRIORITY_SPLITS["house-cleaning"],
  },
  "lawn-care": {
    diyHours: 2,
    outsourceCost: 55,
    efficiencyMultiplier: 2,
    coordinationFriction: "low",
    missDoingIt: "neutral",
    identityRelevance: "medium",
    hourlyTimeValue: 45,
    priorities: PRESET_PRIORITY_SPLITS["lawn-care"],
  },
  "grocery-delivery": {
    diyHours: 1.5,
    outsourceCost: 22,
    efficiencyMultiplier: 2,
    coordinationFriction: "low",
    missDoingIt: "neutral",
    identityRelevance: "low",
    hourlyTimeValue: 50,
    priorities: PRESET_PRIORITY_SPLITS["grocery-delivery"],
  },
  laundry: {
    diyHours: 2.5,
    outsourceCost: 38,
    efficiencyMultiplier: 2,
    coordinationFriction: "medium",
    missDoingIt: "hate-it",
    identityRelevance: "low",
    hourlyTimeValue: 42,
    priorities: PRESET_PRIORITY_SPLITS.laundry,
  },
  "deal-shopping": {
    diyHours: 1.25,
    outsourceCost: 18,
    efficiencyMultiplier: 1,
    coordinationFriction: "high",
    missDoingIt: "neutral",
    identityRelevance: "low",
    hourlyTimeValue: 48,
    priorities: PRESET_PRIORITY_SPLITS["deal-shopping"],
  },
};

const DEAL_SEARCH_PRESETS: Record<
  PresetId,
  Omit<DealSearchFormState, "mode" | "presetId">
> = {
  "house-cleaning": {
    productPrice: 160,
    likelySavings: 20,
    searchHours: 0.5,
    urgency: "medium",
    dealEnjoyment: "hate-it",
    hourlyTimeValue: 55,
    priorities: PRESET_PRIORITY_SPLITS["house-cleaning"],
  },
  "lawn-care": {
    productPrice: 55,
    likelySavings: 10,
    searchHours: 0.5,
    urgency: "medium",
    dealEnjoyment: "neutral",
    hourlyTimeValue: 45,
    priorities: PRESET_PRIORITY_SPLITS["lawn-care"],
  },
  "grocery-delivery": {
    productPrice: 145,
    likelySavings: 12,
    searchHours: 0.25,
    urgency: "high",
    dealEnjoyment: "hate-it",
    hourlyTimeValue: 50,
    priorities: PRESET_PRIORITY_SPLITS["grocery-delivery"],
  },
  laundry: {
    productPrice: 38,
    likelySavings: 8,
    searchHours: 0.4,
    urgency: "low",
    dealEnjoyment: "neutral",
    hourlyTimeValue: 42,
    priorities: PRESET_PRIORITY_SPLITS.laundry,
  },
  "deal-shopping": {
    productPrice: 240,
    likelySavings: 35,
    searchHours: 1,
    urgency: "medium",
    dealEnjoyment: "enjoy-it",
    hourlyTimeValue: 48,
    priorities: PRESET_PRIORITY_SPLITS["deal-shopping"],
  },
};

export function createEmptyPriorityAllocation(): PriorityAllocation {
  return PRIORITY_OPTIONS.reduce((accumulator, category) => {
    accumulator[category] = 0;
    return accumulator;
  }, {} as PriorityAllocation);
}

export function createPriorityAllocation(
  overrides?: Partial<PriorityAllocation>,
): PriorityAllocation {
  return {
    ...createEmptyPriorityAllocation(),
    ...DEFAULT_PRIORITY_SPLIT,
    ...overrides,
  };
}

export function getOutsourceDefaults(presetId: PresetId): OutsourceFormState {
  const preset = OUTSOURCE_PRESETS[presetId];

  return {
    mode: "outsource",
    presetId,
    ...preset,
    priorities: createPriorityAllocation(preset.priorities),
  };
}

export function getDealSearchDefaults(presetId: PresetId): DealSearchFormState {
  const preset = DEAL_SEARCH_PRESETS[presetId];

  return {
    mode: "deal-search",
    presetId,
    ...preset,
    priorities: createPriorityAllocation(preset.priorities),
  };
}

export function getDefaultsForPreset(presetId: PresetId) {
  return {
    outsource: getOutsourceDefaults(presetId),
    "deal-search": getDealSearchDefaults(presetId),
  };
}
