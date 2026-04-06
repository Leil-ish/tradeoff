import type { ModeOption, PresetOption } from "@/lib/types";

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: "outsource",
    label: "Do it myself or outsource?",
    description:
      "Compare the hidden cost of doing a task yourself against paying someone else to take it off your plate.",
  },
  {
    id: "deal-search",
    label: "Should I keep searching for a better deal?",
    description:
      "Pressure-test whether more searching is genuinely worth the time, attention, and delay it asks from you.",
  },
];

export const PRESET_OPTIONS: PresetOption[] = [
  {
    id: "house-cleaning",
    label: "House cleaning",
    summary: "Recurring upkeep, energy drain, and the question of reclaiming a weekend block.",
  },
  {
    id: "lawn-care",
    label: "Lawn care",
    summary: "Outdoor maintenance where cost, weather, and tolerance all matter.",
  },
  {
    id: "grocery-delivery",
    label: "Grocery shopping vs delivery",
    summary: "Errands, substitutions, fees, and how much bandwidth you want back.",
  },
  {
    id: "laundry",
    label: "Laundry",
    summary: "A routine task that can feel grounding or quietly expensive in time.",
  },
  {
    id: "deal-shopping",
    label: "Shopping for a deal on a product",
    summary: "An open-ended search where savings, urgency, and diminishing returns collide.",
  },
];
