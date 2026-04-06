import type {
  DealEnjoymentLevel,
  DealSearchFormState,
  FrictionLevel,
  IdentityLevel,
  MissDoingLevel,
  OutsourceFormState,
  PriorityAllocation,
  PriorityCategory,
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

const MISS_DOING_HOURS: Record<MissDoingLevel, number> = {
  "hate-it": 0.4,
  neutral: 0,
  "would-miss-it": -0.6,
};

const IDENTITY_HOURS: Record<IdentityLevel, number> = {
  low: 0.25,
  medium: 0,
  high: -0.5,
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
      ? "The time cost here is fairly small, so the opportunity cost is limited."
      : "This choice does not materially change how much time you get back.";
  }

  const topSlices = getPrioritySlices(priorities, positiveHours).slice(0, 3);
  const parts = topSlices.map(
    (slice) => `${formatHours(slice.hours)} for ${slice.category.toLowerCase()}`,
  );
  const joinedParts = joinWithAnd(parts);

  if (framing === "reclaimed") {
    return `That reclaimed time could become about ${joinedParts}.`;
  }

  if (framing === "preserved") {
    return `Stopping here keeps about ${joinedParts} available for what you said matters most.`;
  }

  return `Continuing likely asks you to spend about ${joinedParts} instead.`;
}

function getOutsourceSensitivityNote(
  score: number,
  threshold: number,
  hourlyTimeValue: number,
) {
  if (Math.abs(score) > threshold * 1.6) {
    return undefined;
  }

  const priceSwing = Math.max(10, roundCurrency(Math.abs(score)));
  const timeSwing = Math.max(0.25, roundHours(Math.abs(score) / Math.max(hourlyTimeValue, 1)));

  return `This is fairly close. A quote moving by about ${formatCurrency(
    priceSwing,
  )}, or your time estimate shifting by about ${formatHours(
    timeSwing,
  )}, could change the answer.`;
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

  return `This is a close call. Another ${formatCurrency(
    savingsSwing,
  )} of likely savings, or about ${formatHours(
    timeSwing,
  )} more or less search time, could flip the recommendation.`;
}

function getOutsourceInsight(
  inputs: OutsourceFormState,
  comparisonScore: number,
  diyTimeCost: number,
  outsourceCostTotal: number,
  savedTimeHours: number,
) {
  const closeThreshold = Math.max(18, inputs.hourlyTimeValue * 0.3);

  if (Math.abs(comparisonScore) < closeThreshold) {
    return "The economics are fairly close here, so your own preference likely matters more than the math alone.";
  }

  if (
    comparisonScore > closeThreshold &&
    inputs.identityRelevance === "low" &&
    inputs.missDoingIt !== "would-miss-it" &&
    inputs.diyHours >= 2
  ) {
    return "This looks like a strong outsourcing candidate because it appears low-meaning, time-expensive, and fairly easy to hand off.";
  }

  if (
    comparisonScore > closeThreshold &&
    diyTimeCost > outsourceCostTotal * 1.4 &&
    inputs.hourlyTimeValue >= 45
  ) {
    return "You appear to be trading fairly valuable personal time for a relatively modest cost difference.";
  }

  if (
    comparisonScore < -closeThreshold &&
    (inputs.identityRelevance === "high" || inputs.missDoingIt === "would-miss-it")
  ) {
    return "This seems to carry enough personal value that keeping it yourself is about more than efficiency.";
  }

  if (comparisonScore > closeThreshold && savedTimeHours >= 2.5) {
    return "The biggest thing in favor of outsourcing here is not just money, but the amount of time it would return to you.";
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
    return "This is close enough that your tolerance for delay and the appeal of searching likely matter more than a strict expected-value view.";
  }

  if (
    expectedValue < -closeThreshold &&
    searchTimeCost > adjustedSavings &&
    inputs.hourlyTimeValue >= 40
  ) {
    return "You appear to be spending fairly valuable time to chase savings that may not be large enough to justify the search.";
  }

  if (
    recommendedSearchHours > 0 &&
    recommendedSearchHours <= 0.25 &&
    adjustedSavings > 0
  ) {
    return "There may still be a little value left in looking, but this is the kind of decision where a short search is usually enough.";
  }

  if (
    expectedValue < -closeThreshold &&
    inputs.urgency === "high" &&
    inputs.dealEnjoyment !== "enjoy-it"
  ) {
    return "Urgency is doing real work here; the cost of delaying the decision seems to outweigh the likely upside from continued searching.";
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

function evaluateOutsourceDecision(
  inputs: OutsourceFormState,
): OutsourceDecisionResult {
  const diyTimeCost = inputs.diyHours * inputs.hourlyTimeValue;
  const coordinationHours = COORDINATION_HOURS[inputs.coordinationFriction];
  const coordinationCost = coordinationHours * inputs.hourlyTimeValue;
  const outsourceCostTotal = inputs.outsourceCost + coordinationCost;
  const professionalTimeHours = inputs.diyHours / Math.max(inputs.efficiencyMultiplier, 1);

  // Faster professional turnaround matters, but less than the user's own time value,
  // so this is intentionally a modest bonus rather than a full second time calculation.
  const turnaroundBonus =
    Math.max(inputs.diyHours - professionalTimeHours, 0) *
    inputs.hourlyTimeValue *
    0.12;

  // Preference adjustment keeps the recommendation from becoming a pure money-vs-time
  // calculator. Low-identity, disliked work gets a small push toward outsourcing.
  const preferenceAdjustment =
    (MISS_DOING_HOURS[inputs.missDoingIt] +
      IDENTITY_HOURS[inputs.identityRelevance]) *
    inputs.hourlyTimeValue;

  const comparisonScore =
    diyTimeCost - outsourceCostTotal + turnaroundBonus + preferenceAdjustment;

  const closeThreshold = Math.max(18, inputs.hourlyTimeValue * 0.3);
  const savedTimeHours = Math.max(inputs.diyHours - coordinationHours, 0);
  const confidence = getConfidence(comparisonScore, closeThreshold);

  const recommendation =
    comparisonScore >= closeThreshold
      ? "Outsource it"
      : comparisonScore <= -closeThreshold
        ? "Keep it yourself"
        : comparisonScore >= 0
          ? "Slight lean toward outsourcing"
          : "Slight lean toward doing it yourself";

  const summary =
    comparisonScore >= 0
      ? `Buying this back looks worthwhile if getting roughly ${formatHours(
          savedTimeHours,
        )} back would genuinely help right now.`
      : `The savings from outsourcing do not clearly outweigh the cost, hassle, or personal value of keeping this in your own hands.`;

  const rationale = [
    `Doing it yourself likely uses about ${formatCurrency(
      diyTimeCost,
    )} of your time at the hourly value you entered.`,
    `Outsourcing comes out to about ${formatCurrency(
      outsourceCostTotal,
    )} once coordination friction is counted as time-equivalent cost.`,
    inputs.efficiencyMultiplier > 1
      ? `A professional working at about ${inputs.efficiencyMultiplier}x your pace improves the case for outsourcing, especially on turnaround.`
      : `A professional is not meaningfully faster here, so speed does not add much benefit.`,
    inputs.missDoingIt === "would-miss-it" || inputs.identityRelevance === "high"
      ? "Because this task carries some personal or identity value for you, the engine discounts the case for outsourcing."
      : "Because this task seems low-identity or actively disliked, the engine gives outsourcing a modest tilt.",
  ];

  const opportunityCostSummary =
    comparisonScore >= 0
      ? summarizeOpportunityAllocation(inputs.priorities, savedTimeHours, "reclaimed")
      : `Keeping it yourself likely ties up about ${formatHours(
          inputs.diyHours,
        )}. ${summarizeOpportunityAllocation(
          inputs.priorities,
          inputs.diyHours,
          "spent",
        )}`;

  return {
    mode: "outsource",
    inputs,
    comparisonScore,
    diyTimeCost,
    outsourceCostTotal,
    savedTimeHours,
    professionalTimeHours,
    priorities: inputs.priorities,
    recommendation,
    summary,
    insightSummary: getOutsourceInsight(
      inputs,
      comparisonScore,
      diyTimeCost,
      outsourceCostTotal,
      savedTimeHours,
    ),
    rationale,
    netMoneyEstimate:
      comparisonScore >= 0
        ? {
            label: "Estimated spend to outsource",
            value: -outsourceCostTotal,
            display: formatSignedCurrency(-outsourceCostTotal),
          }
        : {
            label: "Estimated spend avoided",
            value: outsourceCostTotal,
            display: formatSignedCurrency(outsourceCostTotal),
          },
    netTimeEstimate:
      comparisonScore >= 0
        ? {
            label: "Time you likely get back",
            value: savedTimeHours,
            display: formatSignedHours(savedTimeHours),
          }
        : {
            label: "Time this will likely take",
            value: -inputs.diyHours,
            display: formatSignedHours(-inputs.diyHours),
          },
    opportunityCostSummary,
    sensitivityNote: getOutsourceSensitivityNote(
      comparisonScore,
      closeThreshold,
      inputs.hourlyTimeValue,
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
    ? `There still appears to be enough value left in the search to justify roughly ${formatHours(
        inputs.searchHours,
      )} more, but not much beyond that.`
    : shouldQuickSearch
      ? `A brief search still makes sense, but the longer version of this search starts to work against the value of your time.`
      : `At your stated time value, the likely savings do not justify continuing to search.`;

  const rationale = [
    `Expected savings compress to about ${formatCurrency(
      adjustedSavings,
    )} after a simple diminishing-returns rule for longer searches.`,
    `The search time itself costs about ${formatCurrency(
      searchTimeCost,
    )} at your hourly value.`,
    `Urgency adds about ${formatCurrency(
      delayCost,
    )} of delay cost, which matters more when you need to decide soon.`,
    inputs.dealEnjoyment === "enjoy-it"
      ? "Because you enjoy deal hunting, the engine gives searching a small positive adjustment, but not enough to override time cost on its own."
      : inputs.dealEnjoyment === "hate-it"
        ? "Because you dislike deal hunting, the engine modestly penalizes continued searching."
        : "Enjoyment is treated as neutral here, so the search mostly stands or falls on time and savings.",
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
        )}. Beyond that, the likely return drops below the value of your time.`
      : "If a better option does not appear in the next 10 to 15 minutes, stop and buy with what you already know.";

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
          : "Likely savings worth pursuing",
      value: recommendedSavings,
      display: formatSignedCurrency(recommendedSavings),
    },
    netTimeEstimate: {
      label:
        recommendedSearchHours > 0
          ? "Time the recommendation asks for"
          : "Time you keep by stopping",
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
