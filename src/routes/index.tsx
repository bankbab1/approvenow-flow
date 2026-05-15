import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const people = [
  "Somchai (Line Manager)",
  "Anan (Department Manager)",
  "Natthapong (Director)",
  "Thanawat (CTO)",
  "Siriporn (CPO-HR)",
  "Supachai (CFO)",
  "Prasert (CEO)",
  "Arthit (Deputy CEO)",
  "Monthon (COO)",
  "Waraporn (Legal Manager)",
  "Kritsada (IT Manager)",
  "Pimchanok (Retail Director)",
  "Nattaya (HRBP)",
  "Rachata (BU Head)",
  "Benjawan (Accounting Manager)",
  "Teerawat (Compliance Manager)",
  "Pitchaya (Transformation Lead)",
  "Duangkamol (Payroll Manager)",
  "Chutima (Compensation Manager)",
  "Apichart (Board Secretary)",
  "Rinrada (Executive Assistant)",
  "Jirawat (Procurement Head)",
];

type Mode = "Single" | "Group";

interface Stage {
  id: number;
  name: string;
  mode: Mode;
  allRequired: boolean;
  requiredCount: number;
  approvers: string[];
}

let nextId = 1;
const newStage = (n: number): Stage => ({
  id: nextId++,
  name: `Stage ${n}`,
  mode: "Single",
  allRequired: true,
  requiredCount: 2,
  approvers: [people[0]],
});

function Index() {
  const [requestName, setRequestName] = useState("");
  const [stages, setStages] = useState<Stage[]>(() => [newStage(1)]);
  const [preview, setPreview] = useState("No Preview");

  const updateStage = (id: number, patch: Partial<Stage>) =>
    setStages((s) => s.map((st) => (st.id === id ? { ...st, ...patch } : st)));

  const addStage = () => setStages((s) => [...s, newStage(s.length + 1)]);

  const removeStage = (id: number) => setStages((s) => s.filter((st) => st.id !== id));

  const addApprover = (id: number) =>
    setStages((s) => s.map((st) => (st.id === id ? { ...st, approvers: [...st.approvers, people[0]] } : st)));

  const removeApprover = (id: number, idx: number) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        const approvers = st.approvers.filter((_, i) => i !== idx);
        if (approvers.length === 0) approvers.push(people[0]);
        const requiredCount = Math.min(st.requiredCount, approvers.length);
        return { ...st, approvers, requiredCount };
      }),
    );

  const setApprover = (id: number, idx: number, value: string) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        const approvers = [...st.approvers];
        approvers[idx] = value;
        return { ...st, approvers };
      }),
    );

  const setMode = (id: number, mode: Mode) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        if (mode === "Single") {
          return { ...st, mode, approvers: st.approvers.slice(0, 1) };
        }
        return { ...st, mode };
      }),
    );

  const previewWorkflow = () => {
    const request = requestName || "Untitled Request";
    let text = `${request}\nSTART\n`;
    stages.forEach((stage, index) => {
      text += `\n↓\n[Stage ${index + 1}] ${stage.name}\n`;
      if (stage.mode === "Single") {
        text += `Mode: Single Approver\nRequired: ${stage.approvers[0]}\n`;
      } else {
        const required = stage.allRequired ? stage.approvers.length : stage.requiredCount;
        text += `Mode: ${required}/${stage.approvers.length} Approvers Required\n`;
        stage.approvers.forEach((u) => (text += `- ${u}\n`));
      }
    });
    text += `\n↓\nEND\n`;
    setPreview(text);
  };

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="mt-0 text-xl font-semibold text-card-foreground">Approval Workflow Builder</h2>
          <input
            value={requestName}
            onChange={(e) => setRequestName(e.target.value)}
            placeholder="Ex: Development Timeline Estimation Request"
            className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={addStage}
              className="rounded-lg bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              + Add Approval Stage
            </button>
            <button
              onClick={previewWorkflow}
              className="rounded-lg bg-secondary px-3.5 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              Preview Workflow
            </button>
          </div>
        </div>

        <div>
          {stages.map((stage, index) => (
            <div key={stage.id} className="mb-5 rounded-2xl bg-card p-5 shadow-sm">
              <span className="mb-3 inline-block rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                Approval Stage {index + 1}
              </span>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <input
                  value={stage.name}
                  onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={() => removeStage(stage.id)}
                  className="rounded-lg bg-destructive px-3.5 py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90"
                >
                  Remove
                </button>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <label className="text-sm text-card-foreground">Approval Type</label>
                <select
                  value={stage.mode}
                  onChange={(e) => setMode(stage.id, e.target.value as Mode)}
                  className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Single</option>
                  <option>Group</option>
                </select>
              </div>

              {stage.mode === "Group" && (
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-card-foreground">
                    <input
                      type="checkbox"
                      checked={stage.allRequired}
                      onChange={(e) => updateStage(stage.id, { allRequired: e.target.checked })}
                    />
                    All Approvers Required
                  </label>
                  {!stage.allRequired && (
                    <span className="flex items-center gap-2 text-sm text-card-foreground">
                      Need
                      <input
                        type="number"
                        min={1}
                        max={stage.approvers.length}
                        value={stage.requiredCount}
                        onChange={(e) =>
                          updateStage(stage.id, {
                            requiredCount: Math.min(stage.approvers.length, Math.max(1, Number(e.target.value) || 1)),
                          })
                        }
                        className="w-16 rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                      approve
                    </span>
                  )}
                </div>
              )}

              <hr className="my-3 border-border" />
              <h3 className="mt-0 mb-2 text-base font-semibold text-card-foreground">Approvers</h3>
              <div>
                {stage.approvers.map((appr, idx) => (
                  <div key={idx} className="mb-2 flex gap-2">
                    <select
                      value={appr}
                      onChange={(e) => setApprover(stage.id, idx, e.target.value)}
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      {people.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeApprover(stage.id, idx)}
                      className="rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              {stage.mode === "Group" && (
                <button
                  onClick={() => addApprover(stage.id)}
                  className="rounded-lg bg-secondary px-3.5 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  + Add Approver
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mb-5 rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="mt-0 mb-3 text-xl font-semibold text-card-foreground">Workflow Preview</h2>
          <pre className="whitespace-pre-line rounded-xl bg-[#111827] p-5 font-mono leading-relaxed text-[#86efac]">
            {preview}
          </pre>
        </div>
      </div>
    </div>
  );
}
