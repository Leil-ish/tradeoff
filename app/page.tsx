"use client";

import { useMemo, useState } from "react";

import { ClockIcon, SparkIcon } from "@/components/icons";
import { DealSearchForm } from "@/components/forms/DealSearchForm";
import { OutsourceForm } from "@/components/forms/OutsourceForm";
import { ResultPanel } from "@/components/ResultPanel";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { MODE_OPTIONS, PRESET_OPTIONS } from "@/lib/constants";
import { evaluateDecision } from "@/lib/decision-engine";
import type {
  DealSearchFormState,
  FormStateByMode,
  OutsourceFormState,
} from "@/lib/form-types";
import {
  getDealSearchDefaults,
  getOutsourceDefaults,
} from "@/lib/presets";
import type { DecisionMode, PresetId } from "@/lib/types";
import {
  countAllocatedPriorityHours,
  getPriorityAllocationError,
  getResultReadiness,
} from "@/lib/validation";

export default function HomePage() {
  const [mode, setMode] = useState<DecisionMode>("outsource");
  const [forms, setForms] = useState<FormStateByMode>({
    outsource: getOutsourceDefaults("house-cleaning"),
    "deal-search": getDealSearchDefaults("deal-shopping"),
  });

  const scenarioSectionId = "scenario-selector";
  const activePreset = forms[mode].presetId;
  const activeForm = forms[mode];
  const currentMode = useMemo(
    () => MODE_OPTIONS.find((option) => option.id === mode),
    [mode],
  );
  const currentPreset = useMemo(
    () => PRESET_OPTIONS.find((option) => option.id === activePreset),
    [activePreset],
  );
  const result = useMemo(() => evaluateDecision(activeForm), [activeForm]);
  const priorityHours = countAllocatedPriorityHours(activeForm.priorities);
  const priorityError = getPriorityAllocationError(priorityHours);
  const resultReadiness = useMemo(
    () => getResultReadiness(activeForm, priorityHours),
    [activeForm, priorityHours],
  );

  const updateOutsourceForm = <K extends keyof OutsourceFormState>(
    key: K,
    value: OutsourceFormState[K],
  ) => {
    setForms((current) => ({
      ...current,
      outsource: {
        ...current.outsource,
        [key]: value,
      },
    }));
  };

  const updateDealSearchForm = <K extends keyof DealSearchFormState>(
    key: K,
    value: DealSearchFormState[K],
  ) => {
    setForms((current) => ({
      ...current,
      "deal-search": {
        ...current["deal-search"],
        [key]: value,
      },
    }));
  };

  const handlePresetChange = (presetId: PresetId) => {
    setForms((current) => ({
      ...current,
      [mode]:
        mode === "outsource"
          ? getOutsourceDefaults(presetId)
          : getDealSearchDefaults(presetId),
    }));
  };

  const resetActiveForm = () => {
    handlePresetChange(activePreset);
  };

  const scrollToScenarioSelector = () => {
    document.getElementById(scenarioSectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const assumptionsNote =
    mode === "outsource"
      ? "Use realistic, slightly messy estimates. Honest approximations are more useful here than perfect numbers."
      : "The likely savings field should reflect what you genuinely expect, not the best-case deal you might find.";

  return (
    <main className="min-h-screen px-3 pb-14 pt-4 sm:px-5 sm:pb-20 sm:pt-7">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-5 lg:gap-6">
        <Card className="overflow-hidden px-4 py-5 sm:px-7 sm:py-7 lg:px-10 lg:py-9">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-accent/15 bg-accent-soft/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent-deep">
                Tradeoff
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-display text-[2.3rem] leading-[1.02] text-ink sm:text-5xl lg:text-[4.25rem]">
                  Make time, money, and what matters visible before you decide.
                </h1>
                <p className="max-w-2xl text-[15px] leading-7 text-ink/72 sm:text-lg sm:leading-8">
                  A structured estimate for deciding whether to do it yourself,
                  outsource it, or stop spending more time chasing a slightly
                  better deal.
                </p>
              </div>
            </div>

            <Card tone="muted" className="p-4 sm:p-5">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  Product framing
                </p>
                <p className="text-sm leading-7 text-ink/72 sm:text-base">
                  Tradeoff is meant to clarify the decision, not overstate it.
                  It turns rough assumptions into a visible trade between money,
                  time, and what that time could become instead.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/82 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                      Looks at
                    </p>
                    <p className="mt-2 text-sm font-semibold text-ink">
                      Time, money, hassle, and personal fit
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/82 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                      Reminder
                    </p>
                    <p className="mt-2 text-sm font-semibold text-ink">
                      No backend, no tracking, no black-box scoring
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr] lg:gap-5">
          <Card className="px-4 py-5 sm:px-6 sm:py-6">
            <SectionHeader
              eyebrow="Step 1"
              title="Choose the decision frame"
              description="Start by telling Tradeoff what kind of choice you are trying to make."
            />

            <div className="mt-5">
              <SegmentedControl
                value={mode}
                onChange={setMode}
                options={MODE_OPTIONS.map((option) => ({
                  value: option.id,
                  label: option.label,
                  description: option.description,
                  icon: option.id === "outsource" ? <SparkIcon /> : <ClockIcon />,
                }))}
              />
            </div>
          </Card>

          <Card tone="muted" className="px-4 py-5 sm:px-6 sm:py-6">
            <SectionHeader
              eyebrow="Current Focus"
              title={currentMode?.label ?? "Choose a mode"}
              description={currentMode?.description}
            />

            <div className="mt-5 rounded-[24px] border border-line/80 bg-white/78 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                What comes next
              </p>
              <p className="mt-3 text-sm leading-7 text-ink/68">
                The form below adapts to this mode, seeds realistic defaults,
                and then translates the time involved into the life categories
                you said you want more of.
              </p>
            </div>
          </Card>
        </div>

        <Card id={scenarioSectionId} className="px-4 py-5 sm:px-6 sm:py-6">
          <SectionHeader
            eyebrow="Step 2"
            title="Start from a realistic scenario"
            description="Preset scenarios seed sensible defaults so the app feels fast, grounded, and easy to adjust."
          />

          <ScenarioSelector
            activePreset={activePreset}
            onSelect={handlePresetChange}
          />

          <div className="mt-5 rounded-[26px] border border-dashed border-line bg-mist/60 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Selected preset
            </p>
            <h3 className="mt-2.5 font-display text-2xl text-ink">
              {currentPreset?.label}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-ink/68">
              {currentPreset?.summary} The preset gives you a credible starting
              point, but you should edit anything that does not feel true to your
              situation.
            </p>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1.06fr_0.94fr] lg:gap-5">
          <Card className="px-4 py-5 sm:px-6 sm:py-6">
            <SectionHeader
              eyebrow="Step 3"
              title="Guided inputs"
              description="Use approximate numbers you would actually stand behind. The tool only needs enough realism to make the trade visible."
            />

            <div className="mt-5 grid gap-4">
              <div className="rounded-[22px] border border-line/80 bg-mist/55 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
                  Assumption note
                </p>
                <p className="mt-2 text-sm leading-7 text-ink/68">
                  {assumptionsNote}
                </p>
              </div>

              {mode === "outsource" ? (
                <OutsourceForm
                  value={forms.outsource}
                  priorityError={priorityError}
                  onChange={updateOutsourceForm}
                />
              ) : (
                <DealSearchForm
                  value={forms["deal-search"]}
                  priorityError={priorityError}
                  onChange={updateDealSearchForm}
                />
              )}

              <div className="rounded-[22px] border border-dashed border-line bg-mist/65 p-4">
                <p className="text-sm leading-7 text-ink/65">
                  Results are based on the assumptions above, not hidden data.
                  Small changes can move a close call, which is why the app calls
                  out sensitivity separately.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={scrollToScenarioSelector}
                >
                  Try another scenario
                </Button>
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={resetActiveForm}
                >
                  Reset to preset defaults
                </Button>
              </div>
            </div>
          </Card>

          <ResultPanel readiness={resultReadiness} result={result} />
        </div>
      </div>
    </main>
  );
}
