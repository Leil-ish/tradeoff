import type { ModeOption, PresetOption } from "@/lib/types";

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: "outsource",
    label: "Do it myself or outsource?",
    description: "Compare doing it yourself with paying someone else.",
  },
  {
    id: "deal-search",
    label: "Should I keep searching for a better deal?",
    description: "Check whether more searching is worth the time.",
  },
];

export const PRESET_OPTIONS: PresetOption[] = [
  {
    id: "house-cleaning",
    label: "House cleaning",
    summary: "Recurring cleaning with a meaningful time cost.",
  },
  {
    id: "lawn-care",
    label: "Lawn care",
    summary: "Routine yard work with weather and upkeep in the mix.",
  },
  {
    id: "grocery-delivery",
    label: "Grocery shopping vs delivery",
    summary: "Errand time versus delivery fees.",
  },
  {
    id: "laundry",
    label: "Laundry",
    summary: "A repeating task that takes more time than it seems.",
  },
  {
    id: "deal-shopping",
    label: "Shopping for a deal on a product",
    summary: "A product search where more time may or may not pay off.",
  },
];
