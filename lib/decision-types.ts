import type {
  DealSearchFormState,
  OutsourceFormState,
  PriorityAllocation,
} from "@/lib/form-types";

export type DecisionConfidence = "low" | "medium" | "high";

export type DecisionMetric = {
  label: string;
  value: number;
  display: string;
  context?: string;
};

export type DecisionLens = {
  label: string;
  summary: string;
};

export type DecisionResultBase = {
  recommendationState?: string;
  recommendation: string;
  summary: string;
  insightSummary?: string;
  rationale: string[];
  lenses?: DecisionLens[];
  netMoneyEstimate: DecisionMetric;
  netTimeEstimate: DecisionMetric;
  opportunityCostSummary: string;
  sensitivityNote?: string;
  stoppingRule?: string;
  confidence: DecisionConfidence;
};

export type OutsourceDecisionResult = DecisionResultBase & {
  mode: "outsource";
  inputs: OutsourceFormState;
  comparisonScore: number;
  diyTimeCost: number;
  outsourceCostTotal: number;
  savedTimeHours: number;
  professionalTimeHours: number;
  priorities: PriorityAllocation;
};

export type DealSearchDecisionResult = DecisionResultBase & {
  mode: "deal-search";
  inputs: DealSearchFormState;
  expectedValue: number;
  adjustedSavings: number;
  quickSearchExpectedValue: number;
  recommendedSearchHours: number;
  priorities: PriorityAllocation;
};

export type DecisionResult = OutsourceDecisionResult | DealSearchDecisionResult;
