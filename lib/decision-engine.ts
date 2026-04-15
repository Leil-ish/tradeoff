import type {
  BarrierLevel,
  BudgetRealityLevel,
  DealEnjoymentLevel,
  DealSearchFormState,
  FrictionLevel,
  OutsourceFormState,
  PersonalValueLevel,
  PriorityAllocation,
  PriorityCategory,
  QualityRiskLevel,
  TaskFrequency,
  TimeUsefulnessLevel,
  UrgencyLevel,
} from "@/lib/form-types";
import type {
  DealSearchDecisionResult,
  DecisionConfidence,
  DecisionResult,
  OutsourceDecisionResult,
} from "@/lib/decision-types";

const COORDINATION_HOURS: Record<FrictionLevel, number> = {
  low: 0.15,
  medium: 0.4,
  high: 0.75,
};

const FREQUENCY_SCORES: Record<TaskFrequency, number> = {
  "one-time": -1,
  occasional: 1,
  recurring: 3,
};

const PERSONAL_VALUE_SCORES: Record<PersonalValueLevel, number> = {
  "hate-it": 2,
  neutral: 0,
  "enjoy-it": -1,
  "would-miss-it": -3,
};

const TIME_USEFULNESS_SCORES: Record<TimeUsefulnessLevel, number> = {
  "not-really": -2,
  somewhat: 1,
  yes: 3,
};

const BUDGET_SCORES: Record<BudgetRealityLevel, number> = {
  easy: 1,
  stretch: -1,
  "not-realistic": -4,
};

const TRUST_SCORES: Record<BarrierLevel, number> = {
  none: 0,
  some: -2,
  high: -5,
};

const QUALITY_SCORES: Record<QualityRiskLevel, number> = {
  low: 0,
  medium: -1,
  high: -4,
};

const URGENCY_HOURS: Record<UrgencyLevel, number> = {
  low: 0.1,
  medium: 0.35,
  high: 0.8,
};

const DEAL_ENJOYMENT_HOURS: Record<DealEnjoymentLevel, number> = {
  "hate-it": -0.15,
  neutral: 0,
  "enjoy-it": 0.2,
};

function roundCurrency(value: number) {
  return Math.round(value);
}

function roundHours(value: number) {
  return Math.round(value * 4) / 4;
}

export function formatCurrency(value: number) {
  const rounded = roundCurrency(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rounded);
}

export function formatHours(hours: number) {
  const absoluteHours = Math.abs(hours);

  if (absoluteHours < 1) {
    const minutes = Math.max(5, Math.round((absoluteHours * 60) / 5) * 5);
    return `${minutes} min`;
  }

  const rounded = Math.round(absoluteHours * 10) / 10;
  const suffix = rounded === 1 ? "hour" : "hours";

  return `${rounded} ${suffix}`;
}

function formatSignedCurrency(value: number) {
  if (value === 0) {
    return formatCurrency(0);
  }

  return `${value > 0 ? "+" : "-"}${formatCurrency(Math.abs(value))}`;
}

function formatSignedHours(value: number) {
  if (value === 0) {
    return "0 min";
  }

  return `${value > 0 ? "+" : "-"}${formatHours(Math.abs(value))}`;
}

function getConfidence(score: number, threshold: number): DecisionConfidence {
  const absoluteScore = Math.abs(score);

  if (absoluteScore < threshold) {
    return "low";
  }

  if (absoluteScore < threshold * 2.2) {
    return "medium";
  }

  return "high";
}

function getPrioritySlices(priorities: PriorityAllocation, hours: number) {
  const totalReferenceHours = 5;

  return (Object.entries(priorities) as [PriorityCategory, number][])
    .filter(([, allocated]) => allocated > 0)
    .map(([category, allocated]) => ({
      category,
      hours: (allocated / totalReferenceHours) * hours,
    }))
    .sort((left, right) => right.hours - left.hours);
}

function joinWithAnd(parts: string[]) {
  if (parts.length <= 1) {
    return parts[0] ?? "";
  }

  if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]}`;
  }

  return `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`;
}

export function summarizeOpportunityAllocation(
  priorities: PriorityAllocation,
  hours: number,
  framing: "reclaimed" | "spent" | "preserved",
) {
  const positiveHours = Math.max(hours, 0);

  if (positiveHours < 0.1) {
    return framing === "spent"
      ? "The time cost here is small."
      : "This choice does not change your time much.";
  }

  const topSlices = getPrioritySlices(priorities, positiveHours).slice(0, 3);
  const parts = topSlices.map(
    (slice) => `${formatHours(slice.hours)} for ${slice.category.toLowerCase()}`,
  );
  const joinedParts = joinWithAnd(parts);

  if (framing === "reclaimed") {
    return `That time could go to about ${joinedParts}.`;
  }

  if (framing === "preserved") {
    return `Stopping here keeps about ${joinedParts} available.`;
  }

  return `Continuing likely uses about ${joinedParts} instead.`;
}

function getOutsourceSensitivityNote(
  inputs: OutsourceFormState,
  effectiveHourlyCost: number,
  savedTimeHours: number,
  recommendationState: string,
  confidence: DecisionConfidence,
) {
  if (confidence === "high") {
    return undefined;
  }

  if (recommendationState === "trial-outsource-for-1-month") {
    return "This is promising, but still uncertain. A short trial is more reliable than trying to reason your way to certainty up front.";
  }

  if (recommendationState === "not-enough-clarity-yet") {
    return `This looks close. A cleaner quote, or a more realistic read on whether ${formatHours(
      savedTimeHours,
    )} would become usable time, would likely change the answer.`;
  }

  if (inputs.budgetReality === "stretch") {
    return "The logic leans one way, but the budget side is close enough that a modest price change could move this into a different recommendation.";
  }

  return `At roughly ${formatCurrency(
    effectiveHourlyCost,
  )} per hour saved, this depends a lot on whether the time back would actually feel usable in your week.`;
}

function getDealSensitivityNote(
  expectedValue: number,
  threshold: number,
  hourlyTimeValue: number,
) {
  if (Math.abs(expectedValue) > threshold * 1.5) {
    return undefined;
  }

  const savingsSwing = Math.max(5, roundCurrency(Math.abs(expectedValue)));
  const timeSwing = Math.max(0.25, roundHours(Math.abs(expectedValue) / Math.max(hourlyTimeValue, 1)));

  return `This is close. Another ${formatCurrency(
    savingsSwing,
  )} of likely savings, or about ${formatHours(
    timeSwing,
  )} more or less search time, could flip the recommendation.`;
}

function getOutsourceInsight(
  recommendationState: string,
  inputs: OutsourceFormState,
  savedTimeHours: number,
) {
  if (recommendationState === "money-is-the-actual-constraint") {
    return "The issue is not whether help would be useful. It is that the current spend does not feel realistic.";
  }

  if (recommendationState === "coordination-cost-cancels-the-savings") {
    return "In theory this could save time, but the handoff work is eating too much of the gain.";
  }

  if (recommendationState === "outsource-it" && savedTimeHours >= 2) {
    return "The case for handing this off is mostly about protecting recurring time, not chasing efficiency for its own sake.";
  }

  if (recommendationState === "keep-doing-it-yourself") {
    if (
      inputs.personalValue === "enjoy-it" ||
      inputs.personalValue === "would-miss-it"
    ) {
      return "Keeping it yourself is reasonable because the task has real personal value for you.";
    }

    return "Outsourcing does not look clean enough in real life to beat just doing it yourself.";
  }

  if (recommendationState === "outsource-only-the-worst-part") {
    return "A split approach avoids forcing an all-or-nothing decision where neither option is great.";
  }

  if (recommendationState === "reduce-frequency") {
    return "The problem may be the current cadence more than the task itself.";
  }

  if (recommendationState === "batch-it") {
    return "You may get most of the benefit by doing this less often and with fewer starts and stops.";
  }

  if (recommendationState === "reduce-the-standard") {
    return "The biggest win may be lowering the standard instead of paying someone else to maintain it.";
  }

  return undefined;
}

function getDealSearchInsight(
  inputs: DealSearchFormState,
  expectedValue: number,
  adjustedSavings: number,
  searchTimeCost: number,
  recommendedSearchHours: number,
) {
  const closeThreshold = Math.max(8, inputs.hourlyTimeValue * 0.2);

  if (Math.abs(expectedValue) < closeThreshold) {
    return "This is close enough that your own tolerance for more searching matters most.";
  }

  if (
    expectedValue < -closeThreshold &&
    searchTimeCost > adjustedSavings &&
    inputs.hourlyTimeValue >= 40
  ) {
    return "You may be spending too much time for the savings left here.";
  }

  if (
    recommendedSearchHours > 0 &&
    recommendedSearchHours <= 0.25 &&
    adjustedSavings > 0
  ) {
    return "There may still be a little value left here, but this looks like a quick check, not a long search.";
  }

  if (
    expectedValue < -closeThreshold &&
    inputs.urgency === "high" &&
    inputs.dealEnjoyment !== "enjoy-it"
  ) {
    return "Urgency matters more here than saving a little more.";
  }

  return undefined;
}

function getDiminishingSavingsFactor(searchHours: number) {
  if (searchHours <= 0.25) {
    return 1;
  }

  if (searchHours <= 0.5) {
    return 0.9;
  }

  if (searchHours <= 1) {
    return 0.75;
  }

  if (searchHours <= 1.5) {
    return 0.6;
  }

  return 0.45;
}

function getQuickSearchShare(searchHours: number) {
  if (searchHours <= 0.25) {
    return 1;
  }

  if (searchHours <= 0.5) {
    return 0.65;
  }

  if (searchHours <= 1) {
    return 0.45;
  }

  return 0.3;
}

function getTaskBurdenScore(hours: number) {
  if (hours < 1) {
    return 0;
  }

  if (hours < 2) {
    return 1;
  }

  if (hours < 3.5) {
    return 2;
  }

  return 3;
}

function getEffectiveHourlyCostBand(value: number) {
  if (value <= 18) {
    return 2;
  }

  if (value <= 35) {
    return 1;
  }

  if (value <= 60) {
    return 0;
  }

  if (value <= 90) {
    return -1;
  }

  return -3;
}

function getRecommendationLabel(state: string) {
  switch (state) {
    case "outsource-it":
      return "Outsource it";
    case "keep-doing-it-yourself":
      return "Keep doing it yourself";
    case "trial-outsource-for-1-month":
      return "Trial outsource for 1 month";
    case "outsource-only-the-worst-part":
      return "Outsource only the worst part";
    case "batch-it":
      return "Batch it";
    case "reduce-the-standard":
      return "Reduce the standard";
    case "reduce-frequency":
      return "Reduce frequency";
    case "redesign-the-system":
      return "Redesign the system";
    case "coordination-cost-cancels-the-savings":
      return "Coordination cost cancels the savings";
    case "money-is-the-actual-constraint":
      return "Money is the actual constraint";
    default:
      return "Not enough clarity yet";
  }
}

function getPresetRedesignState(inputs: OutsourceFormState) {
  if (inputs.presetId === "grocery-delivery") {
    return "batch-it";
  }

  if (
    inputs.presetId === "house-cleaning" ||
    inputs.presetId === "lawn-care" ||
    inputs.presetId === "laundry"
  ) {
    return inputs.frequency === "recurring"
      ? "reduce-frequency"
      : "reduce-the-standard";
  }

  return "redesign-the-system";
}

function evaluateOutsourceDecision(
  inputs: OutsourceFormState,
): OutsourceDecisionResult {
  const coordinationHours = COORDINATION_HOURS[inputs.handoffFriction];
  const outsourceCostTotal = inputs.outsourceCost;
  const savedTimeHours = Math.max(inputs.diyHours - coordinationHours, 0);
  const effectiveHourlyCost = outsourceCostTotal / Math.max(savedTimeHours, 0.25);

  const practicalScore =
    getTaskBurdenScore(inputs.diyHours) * 2 +
    FREQUENCY_SCORES[inputs.frequency] +
    TIME_USEFULNESS_SCORES[inputs.timeUsefulness] +
    getEffectiveHourlyCostBand(effectiveHourlyCost) +
    BUDGET_SCORES[inputs.budgetReality] +
    TRUST_SCORES[inputs.trustBarrier] +
    QUALITY_SCORES[inputs.qualityRisk] +
    PERSONAL_VALUE_SCORES[inputs.personalValue] -
    (inputs.handoffFriction === "high" ? 2 : inputs.handoffFriction === "medium" ? 1 : 0);

  const feasibilityPenalty =
    (inputs.trustBarrier === "high" ? 3 : 0) +
    (inputs.qualityRisk === "high" ? 3 : 0) +
    (inputs.budgetReality === "not-realistic" ? 3 : 0);
  const mixedSignals =
    (inputs.personalValue === "enjoy-it" || inputs.personalValue === "would-miss-it"
      ? 1
      : 0) +
    (inputs.handoffFriction === "high" ? 1 : 0) +
    (inputs.trustBarrier === "some" ? 1 : 0) +
    (inputs.qualityRisk === "medium" ? 1 : 0) +
    (inputs.timeUsefulness === "somewhat" ? 1 : 0);

  let recommendationState = "not-enough-clarity-yet";

  if (
    inputs.budgetReality === "not-realistic" &&
    practicalScore >= 2 &&
    savedTimeHours >= 1
  ) {
    recommendationState = "money-is-the-actual-constraint";
  } else if (
    inputs.handoffFriction === "high" &&
    savedTimeHours <= 1.25 &&
    inputs.trustBarrier !== "high"
  ) {
    recommendationState = "coordination-cost-cancels-the-savings";
  } else if (
    inputs.trustBarrier === "high" ||
    inputs.qualityRisk === "high"
  ) {
    recommendationState =
      inputs.splitPotential === "yes" && inputs.personalValue !== "would-miss-it"
        ? "outsource-only-the-worst-part"
        : inputs.personalValue === "hate-it"
          ? getPresetRedesignState(inputs)
          : "keep-doing-it-yourself";
  } else if (
    practicalScore >= 6 &&
    inputs.personalValue !== "would-miss-it" &&
    inputs.budgetReality !== "not-realistic"
  ) {
    recommendationState =
      mixedSignals >= 2 ? "trial-outsource-for-1-month" : "outsource-it";
  } else if (
    practicalScore >= 3 &&
    inputs.splitPotential === "yes" &&
    (inputs.personalValue === "enjoy-it" ||
      inputs.handoffFriction === "medium" ||
      inputs.qualityRisk === "medium")
  ) {
    recommendationState = "outsource-only-the-worst-part";
  } else if (
    practicalScore <= -2 ||
    inputs.personalValue === "would-miss-it"
  ) {
    recommendationState = "keep-doing-it-yourself";
  } else if (
    inputs.frequency === "recurring" &&
    inputs.personalValue === "hate-it" &&
    inputs.budgetReality !== "easy"
  ) {
    recommendationState = getPresetRedesignState(inputs);
  }

  const confidence =
    feasibilityPenalty >= 3 || mixedSignals >= 3
      ? "low"
      : practicalScore >= 7 || practicalScore <= -3
        ? "high"
        : "medium";

  const recommendation = getRecommendationLabel(recommendationState);

  const summaryMap: Record<string, string> = {
    "outsource-it": `This looks worth handing off. The time burden is real, the task repeats enough to justify setup, and the practical barriers are low enough that help should create real relief.`,
    "keep-doing-it-yourself": `Keeping this yourself looks more grounded than outsourcing it. Either the task has real personal value, or the handoff risks are high enough that paying for help would not feel clean in practice.`,
    "trial-outsource-for-1-month": `The case for help is real, but not clean enough for a confident permanent call. A short trial is the safest way to see whether this actually removes work or just changes its shape.`,
    "outsource-only-the-worst-part": `An all-or-nothing choice is too blunt here. The strongest move is to hand off the most draining part while keeping the parts where your standards or preferences matter most.`,
    "batch-it": `The problem looks less like the task itself and more like how often it interrupts your week. A batching approach may recover most of the benefit without adding a service relationship.`,
    "reduce-the-standard": `The current standard appears to be carrying more weight than the task really needs to. Lowering the bar slightly may beat either full DIY effort or full outsourcing.`,
    "reduce-frequency": `This likely does not need to happen as often as it currently does. Reducing the cadence may solve more of the burden than outsourcing would.`,
    "redesign-the-system": `The best answer here is probably not pure DIY or pure outsourcing. A system change would likely help more than pushing harder on the current setup.`,
    "coordination-cost-cancels-the-savings": `The raw time math is not the real issue here. The setup, access, and follow-up burden are taking too much back for outsourcing to feel genuinely relieving.`,
    "money-is-the-actual-constraint": `Handing this off may help in theory, but the budget side is the real blocker right now. That is different from the task not being worth help.`,
    "not-enough-clarity-yet": `This is a close call with mixed signals. The right move depends on whether the time back would be meaningfully usable and whether the real-world handoff would stay manageable.`,
  };

  const rationale = [
    `Doing it yourself still takes about ${formatHours(inputs.diyHours)} each time.`,
    `After handoff admin, the realistic time back is closer to ${formatHours(savedTimeHours)}.`,
    `The current quote works out to about ${formatCurrency(
      effectiveHourlyCost,
    )} per hour saved.`,
    inputs.timeUsefulness === "yes"
      ? "That saved time looks usable enough to matter in real life."
      : inputs.timeUsefulness === "somewhat"
        ? "Some of the time back looks useful, but not all of it."
        : "The time back does not look very reclaimable, which weakens the case for paying to save it.",
    inputs.personalValue === "hate-it"
      ? "You do not seem to get much personal value from doing this yourself."
      : inputs.personalValue === "neutral"
        ? "This task seems emotionally neutral, so practical tradeoffs matter more."
        : "Doing this yourself appears to carry some real personal value.",
  ];

  const opportunityCostSummary =
    recommendationState === "keep-doing-it-yourself"
      ? `Keeping it yourself still uses about ${formatHours(
          inputs.diyHours,
        )}. ${summarizeOpportunityAllocation(
          inputs.priorities,
          inputs.diyHours,
          "spent",
        )}`
      : summarizeOpportunityAllocation(inputs.priorities, savedTimeHours, "reclaimed");

  return {
    mode: "outsource",
    inputs,
    comparisonScore: practicalScore,
    diyTimeCost: effectiveHourlyCost * inputs.diyHours,
    outsourceCostTotal,
    savedTimeHours,
    professionalTimeHours: 0,
    priorities: inputs.priorities,
    recommendationState,
    recommendation,
    summary: summaryMap[recommendationState],
    insightSummary: getOutsourceInsight(
      recommendationState,
      inputs,
      savedTimeHours,
    ),
    rationale,
    lenses: [
      {
        label: "Practical reality",
        summary: `${inputs.frequency === "recurring" ? "Recurring" : "Limited"} burden with ${inputs.handoffFriction} handoff overhead and ${inputs.qualityRisk} mismatch risk.`,
      },
      {
        label: "Psychological fit",
        summary:
          inputs.personalValue === "hate-it"
            ? "This looks like draining maintenance, not meaningful DIY."
            : inputs.personalValue === "neutral"
              ? "This is mostly a practical decision rather than an identity one."
              : "There is some non-economic value in keeping this in your own hands.",
      },
      {
        label: "Feasibility",
        summary:
          inputs.budgetReality === "not-realistic"
            ? "Budget is the main constraint right now."
            : inputs.trustBarrier === "high"
              ? "Trust or privacy concerns make full outsourcing weak."
              : "No major hard blocker is showing up.",
      },
    ],
    netMoneyEstimate: {
      label: "Budget fit",
      value:
        inputs.budgetReality === "easy"
          ? 2
          : inputs.budgetReality === "stretch"
            ? 1
            : 0,
      display:
        inputs.budgetReality === "easy"
          ? "Comfortable"
          : inputs.budgetReality === "stretch"
            ? "A stretch"
            : "Not realistic",
      context: `At the current quote of ${formatCurrency(outsourceCostTotal)}.`,
    },
    netTimeEstimate: {
      label: "Real time back",
      value: savedTimeHours,
      display: formatSignedHours(savedTimeHours),
      context: `After ${formatHours(coordinationHours)} of handoff work.`,
    },
    opportunityCostSummary,
    sensitivityNote: getOutsourceSensitivityNote(
      inputs,
      effectiveHourlyCost,
      savedTimeHours,
      recommendationState,
      confidence,
    ),
    confidence,
  };
}

function evaluateDealSearchDecision(
  inputs: DealSearchFormState,
): DealSearchDecisionResult {
  const searchTimeCost = inputs.searchHours * inputs.hourlyTimeValue;

  // Savings decay on purpose as the search drags on. This keeps the engine from
  // assuming each extra minute is as productive as the first few minutes.
  const diminishingSavingsFactor = getDiminishingSavingsFactor(inputs.searchHours);
  const adjustedSavings = inputs.likelySavings * diminishingSavingsFactor;
  const delayCost =
    URGENCY_HOURS[inputs.urgency] *
    inputs.hourlyTimeValue *
    Math.min(inputs.searchHours, 1.5);
  const enjoymentAdjustment =
    DEAL_ENJOYMENT_HOURS[inputs.dealEnjoyment] * inputs.hourlyTimeValue;

  const expectedValue =
    adjustedSavings - searchTimeCost - delayCost + enjoymentAdjustment;

  const quickSearchHours = inputs.urgency === "high" ? 0.17 : 0.25;
  const quickSearchSavings =
    inputs.likelySavings * getQuickSearchShare(inputs.searchHours);
  const quickSearchDelayCost =
    URGENCY_HOURS[inputs.urgency] * inputs.hourlyTimeValue * quickSearchHours;
  const quickSearchExpectedValue =
    quickSearchSavings -
    quickSearchHours * inputs.hourlyTimeValue -
    quickSearchDelayCost +
    enjoymentAdjustment;

  const closeThreshold = Math.max(8, inputs.hourlyTimeValue * 0.2);
  const confidence = getConfidence(expectedValue, closeThreshold);

  const shouldQuickSearch =
    quickSearchExpectedValue > 4 &&
    (expectedValue < 12 || inputs.searchHours > 0.5);
  const shouldKeepSearching = expectedValue >= 12 && inputs.searchHours <= 0.75;

  const recommendation = shouldKeepSearching
    ? "Keep searching a bit longer"
    : shouldQuickSearch
      ? "Do a quick search, then stop"
      : "Stop searching";

  const recommendedSearchHours = shouldKeepSearching
    ? inputs.searchHours
    : shouldQuickSearch
      ? quickSearchHours
      : 0;

  const recommendedSavings = shouldKeepSearching
    ? adjustedSavings
    : shouldQuickSearch
      ? quickSearchSavings
      : 0;

  const summary = shouldKeepSearching
    ? `There may still be enough here to justify roughly ${formatHours(
        inputs.searchHours,
      )} more, but probably not much beyond that.`
    : shouldQuickSearch
      ? `A brief search is reasonable. Beyond that, the likely return starts to fall below the value of your time.`
      : `The savings likely are not large enough to justify more searching.`;

  const rationale = [
    `Likely savings compress to about ${formatCurrency(
      adjustedSavings,
    )} after applying a simple diminishing-returns rule for longer searches.`,
    `The search itself costs about ${formatCurrency(
      searchTimeCost,
    )} at the hourly value you gave your time.`,
    `Delay adds about ${formatCurrency(
      delayCost,
    )} here, which matters more when the purchase feels urgent.`,
    inputs.dealEnjoyment === "enjoy-it"
      ? "Enjoying deal hunting helps a little, but not enough to outweigh time cost on its own."
      : inputs.dealEnjoyment === "hate-it"
        ? "Disliking deal hunting weakens the case for more searching."
        : "This mostly comes down to time and savings.",
  ];

  const opportunityCostSummary =
    recommendedSearchHours > 0
      ? summarizeOpportunityAllocation(
          inputs.priorities,
          recommendedSearchHours,
          "spent",
        )
      : summarizeOpportunityAllocation(inputs.priorities, inputs.searchHours, "preserved");

  const stoppingRule =
    shouldKeepSearching || shouldQuickSearch
      ? `Cap the search at about ${formatHours(
          recommendedSearchHours,
        )}. Beyond that, the likely return drops below what your time is worth.`
      : "If a better option does not appear in the next 10 to 15 minutes, stop and buy.";

  return {
    mode: "deal-search",
    inputs,
    expectedValue,
    adjustedSavings,
    quickSearchExpectedValue,
    recommendedSearchHours,
    priorities: inputs.priorities,
    recommendation,
    summary,
    insightSummary: getDealSearchInsight(
      inputs,
      expectedValue,
      adjustedSavings,
      searchTimeCost,
      recommendedSearchHours,
    ),
    rationale,
    netMoneyEstimate: {
      label:
        recommendedSearchHours > 0
          ? "Likely savings still on the table"
          : "Likely savings",
      value: recommendedSavings,
      display: formatSignedCurrency(recommendedSavings),
    },
    netTimeEstimate: {
      label:
        recommendedSearchHours > 0
          ? "Time the recommendation asks for"
          : "Time kept by stopping",
      value: recommendedSearchHours > 0 ? -recommendedSearchHours : inputs.searchHours,
      display: formatSignedHours(
        recommendedSearchHours > 0 ? -recommendedSearchHours : inputs.searchHours,
      ),
    },
    opportunityCostSummary,
    sensitivityNote: getDealSensitivityNote(
      expectedValue,
      closeThreshold,
      inputs.hourlyTimeValue,
    ),
    stoppingRule,
    confidence,
  };
}

export function evaluateDecision(
  inputs: OutsourceFormState | DealSearchFormState,
): DecisionResult {
  return inputs.mode === "outsource"
    ? evaluateOutsourceDecision(inputs)
    : evaluateDealSearchDecision(inputs);
}
