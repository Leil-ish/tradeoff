import { ArrowTrendIcon, CheckIcon, HourglassIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { DecisionResult } from "@/lib/decision-types";
import type { ResultReadiness } from "@/lib/validation";

type ResultPanelProps = {
  readiness: ResultReadiness;
  result: DecisionResult;
};

function PendingState({ readiness }: { readiness: ResultReadiness }) {
  return (
    <div className="space-y-4">
      <div className="rounded-[26px] border border-white/75 bg-white/84 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Result pending
        </p>
        <h3 className="mt-3 font-display text-2xl text-ink">
          Add a few more details to get a read.
        </h3>
        <p className="mt-3 text-sm leading-7 text-ink/68">
          There needs to be enough here to compare the money cost with the time
          cost.
        </p>
      </div>

      <div className="rounded-[22px] border border-white/70 bg-white/70 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
          What still needs attention
        </p>
        <ul className="mt-3 space-y-3 text-sm leading-7 text-ink/72">
          {readiness.missing.map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <span
                className={`mt-1.5 flex h-5 w-5 items-center justify-center rounded-full ${
                  item.valid
                    ? "bg-accent-soft text-accent-deep"
                    : "bg-sand text-ink/55"
                }`}
              >
                {item.valid ? <CheckIcon /> : <HourglassIcon />}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ReadyState({ result }: { result: DecisionResult }) {
  return (
    <div className="space-y-4">
      <div className="rounded-[26px] border border-white/80 bg-white/88 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Best current read
            </p>
            <h3 className="mt-3 font-display text-2xl text-ink sm:text-[2rem]">
              {result.recommendation}
            </h3>
          </div>
          <div className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep">
            {result.confidence} confidence
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/72 sm:text-base">
          {result.summary}
        </p>

        {result.insightSummary ? (
          <div className="mt-4 rounded-[20px] border border-accent/12 bg-accent-soft/55 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep/80">
              Insight
            </p>
            <p className="mt-1.5 text-sm leading-6 text-ink/72">
              {result.insightSummary}
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[22px] bg-white/72 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-ink/42">
            {result.netMoneyEstimate.label}
          </p>
          <p className="mt-2 text-lg font-semibold text-ink">
            {result.netMoneyEstimate.display}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink/62">
            {result.netMoneyEstimate.context ?? "A practical money read for this choice."}
          </p>
        </div>

        <div className="rounded-[22px] bg-white/72 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-ink/42">
            {result.netTimeEstimate.label}
          </p>
          <p className="mt-2 text-lg font-semibold text-ink">
            {result.netTimeEstimate.display}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink/62">
            {result.netTimeEstimate.context ?? "How the choice changes your time."}
          </p>
        </div>

        <div className="rounded-[22px] bg-white/72 p-4 sm:col-span-2 xl:col-span-1">
          <p className="text-xs uppercase tracking-[0.16em] text-ink/42">
            What this time could go toward
          </p>
          <p className="mt-2 text-sm leading-6 text-ink/72">
            {result.opportunityCostSummary}
          </p>
        </div>
      </div>

      {result.lenses?.length ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {result.lenses.map((lens) => (
            <div
              key={lens.label}
              className="rounded-[22px] border border-white/70 bg-white/64 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
                {lens.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                {lens.summary}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="rounded-[22px] border border-white/70 bg-white/64 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent-deep">
            <ArrowTrendIcon />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              Why
            </p>
            <p className="text-sm text-ink/62">
              Based on the inputs above.
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/72">
          {result.rationale.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {result.stoppingRule ? (
        <div className="rounded-[22px] border border-line bg-white/70 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
            Stopping rule
          </p>
          <p className="mt-3 text-sm leading-7 text-ink/72">
            {result.stoppingRule}
          </p>
        </div>
      ) : null}

      {result.sensitivityNote ? (
        <div className="rounded-[22px] border border-line bg-white/70 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
            Sensitivity and assumptions
          </p>
          <p className="mt-3 text-sm leading-7 text-ink/72">
            {result.sensitivityNote}
          </p>
        </div>
      ) : (
        <div className="rounded-[22px] border border-line/70 bg-white/55 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
            Assumptions
          </p>
          <p className="mt-3 text-sm leading-7 text-ink/66">
            This depends mostly on the time, cost, and savings numbers you
            entered.
          </p>
        </div>
      )}
    </div>
  );
}

type Props = ResultPanelProps;

export function ResultPanel({ readiness, result }: Props) {
  return (
    <Card tone="accent" className="px-4 py-5 sm:px-6 sm:py-6">
      <SectionHeader
        eyebrow="Step 4"
        title="Results"
        description="Updates from the inputs on the left."
      />

      <div className="mt-5 transition-all duration-300">
        {readiness.isReady ? (
          <ReadyState result={result} />
        ) : (
          <PendingState readiness={readiness} />
        )}
      </div>
    </Card>
  );
}
