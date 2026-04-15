import type { DecisionMode, PresetId } from "@/lib/types";

export const PRIORITY_OPTIONS = [
  "Kids / family",
  "Partner / relationships",
  "Exercise / health",
  "Rest / recovery",
  "Work / earning",
  "Friends / community",
  "Hobbies / creativity",
  "General life admin",
] as const;

export type PriorityCategory = (typeof PRIORITY_OPTIONS)[number];

export type FrictionLevel = "low" | "medium" | "high";
export type IdentityLevel = "low" | "medium" | "high";
export type MissDoingLevel = "hate-it" | "neutral" | "would-miss-it";
export type UrgencyLevel = "low" | "medium" | "high";
export type DealEnjoymentLevel = "hate-it" | "neutral" | "enjoy-it";
export type TaskFrequency = "one-time" | "occasional" | "recurring";
export type BarrierLevel = "none" | "some" | "high";
export type QualityRiskLevel = "low" | "medium" | "high";
export type PersonalValueLevel =
  | "hate-it"
  | "neutral"
  | "enjoy-it"
  | "would-miss-it";
export type TimeUsefulnessLevel = "not-really" | "somewhat" | "yes";
export type BudgetRealityLevel = "easy" | "stretch" | "not-realistic";
export type SplitPotential = "no" | "yes";

export type PriorityAllocation = Record<PriorityCategory, number>;

export type OutsourceFormState = {
  mode: Extract<DecisionMode, "outsource">;
  presetId: PresetId;
  diyHours: number;
  outsourceCost: number;
  frequency: TaskFrequency;
  handoffFriction: FrictionLevel;
  trustBarrier: BarrierLevel;
  qualityRisk: QualityRiskLevel;
  personalValue: PersonalValueLevel;
  timeUsefulness: TimeUsefulnessLevel;
  budgetReality: BudgetRealityLevel;
  splitPotential: SplitPotential;
  priorities: PriorityAllocation;
};

export type DealSearchFormState = {
  mode: Extract<DecisionMode, "deal-search">;
  presetId: PresetId;
  productPrice: number;
  likelySavings: number;
  searchHours: number;
  urgency: UrgencyLevel;
  dealEnjoyment: DealEnjoymentLevel;
  hourlyTimeValue: number;
  priorities: PriorityAllocation;
};

export type FormStateByMode = {
  outsource: OutsourceFormState;
  "deal-search": DealSearchFormState;
};
