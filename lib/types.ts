export type DecisionMode = "outsource" | "deal-search";

export type PresetId =
  | "house-cleaning"
  | "lawn-care"
  | "grocery-delivery"
  | "laundry"
  | "deal-shopping";

export type ModeOption = {
  id: DecisionMode;
  label: string;
  description: string;
};

export type PresetOption = {
  id: PresetId;
  label: string;
  summary: string;
};
