import { CheckCircle2, CircleAlert, Info, XCircle } from "lucide-react";
import type { StepState } from "@/content/schema";
import DataTable from "./DataTable";
import Dag from "./Dag";
import { cn } from "@/lib/utils";

const RESULT = {
  pass: { icon: CheckCircle2, label: "Pass", cls: "border-good/50 bg-good-wash text-good" },
  fail: { icon: XCircle, label: "Fail", cls: "border-bad/50 bg-bad-wash text-bad" },
  warn: { icon: CircleAlert, label: "Warning", cls: "border-warn/50 bg-warn-wash text-warn" },
  info: { icon: Info, label: "Result", cls: "border-border bg-card text-foreground" },
};

/** Renders a step's prepared state: table, result panel, diagram or comparison. */
export default function StateView({ state }: { state: StepState }) {
  if (state.kind === "table") {
    return (
      <div>
        {state.title && <p className="provenance mb-2 text-foreground/80">{state.title}</p>}
        <DataTable columns={state.columns} rows={state.rows} highlightRows={state.highlight_rows} caption={state.caption} />
      </div>
    );
  }
  if (state.kind === "comparison") {
    return (
      <div>
        {state.title && <p className="provenance mb-2 text-foreground/80">{state.title}</p>}
        <DataTable columns={state.columns} rows={state.rows} caption={state.caption} />
      </div>
    );
  }
  if (state.kind === "diagram") {
    return <Dag diagram={state.diagram} title={state.title} />;
  }
  const r = RESULT[state.result_status ?? "info"];
  const Icon = r.icon;
  return (
    <div className={cn("rounded-md border p-3", r.cls)}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="font-mono text-xs uppercase tracking-wider">{r.label}</span>
        {state.title && <span className="text-sm text-foreground">· {state.title}</span>}
      </div>
      {state.message && <p className="mt-2 text-sm text-foreground">{state.message}</p>}
      {state.columns && state.rows && (
        <div className="mt-3 text-foreground">
          <DataTable columns={state.columns} rows={state.rows} compact />
        </div>
      )}
      {state.caption && <p className="mt-2 text-xs text-foreground/70">{state.caption}</p>}
    </div>
  );
}
