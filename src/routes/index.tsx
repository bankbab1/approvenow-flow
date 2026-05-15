import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Users,
  User,
  GitBranch,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Flag,
  ArrowDown,
  CircleDot,
  X,
  Workflow,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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

interface StageIssue {
  stageId: number;
  index: number;
  message: string;
}

function validate(stages: Stage[]): StageIssue[] {
  const issues: StageIssue[] = [];
  stages.forEach((s, i) => {
    if (!s.name.trim()) {
      issues.push({ stageId: s.id, index: i, message: "Stage name is empty." });
    }
    if (s.approvers.length === 0) {
      issues.push({ stageId: s.id, index: i, message: "No approvers added." });
    }
    const dup = new Set<string>();
    for (const a of s.approvers) {
      if (dup.has(a)) {
        issues.push({
          stageId: s.id,
          index: i,
          message: "Duplicate approvers in this stage.",
        });
        break;
      }
      dup.add(a);
    }
    if (s.mode === "Group" && !s.allRequired) {
      if (s.requiredCount > s.approvers.length) {
        issues.push({
          stageId: s.id,
          index: i,
          message: `Requires ${s.requiredCount} approvals but only ${s.approvers.length} approver(s) added.`,
        });
      }
      if (s.requiredCount < 1) {
        issues.push({
          stageId: s.id,
          index: i,
          message: "Required approvals must be at least 1.",
        });
      }
    }
  });
  return issues;
}

function Index() {
  const [requestName, setRequestName] = useState("");
  const [stages, setStages] = useState<Stage[]>(() => [newStage(1)]);
  const [showPreview, setShowPreview] = useState(false);

  const issues = useMemo(() => validate(stages), [stages]);
  const issuesByStage = useMemo(() => {
    const m = new Map<number, StageIssue[]>();
    for (const i of issues) {
      const arr = m.get(i.stageId) ?? [];
      arr.push(i);
      m.set(i.stageId, arr);
    }
    return m;
  }, [issues]);
  const isValid = issues.length === 0;

  const updateStage = (id: number, patch: Partial<Stage>) =>
    setStages((s) => s.map((st) => (st.id === id ? { ...st, ...patch } : st)));

  const addStage = () =>
    setStages((s) => [...s, newStage(s.length + 1)]);

  const removeStage = (id: number) =>
    setStages((s) => s.filter((st) => st.id !== id));

  const addApprover = (id: number) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        const remaining = people.find((p) => !st.approvers.includes(p)) ?? people[0];
        return { ...st, approvers: [...st.approvers, remaining] };
      }),
    );

  const removeApprover = (id: number, idx: number) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        const approvers = st.approvers.filter((_, i) => i !== idx);
        const requiredCount = Math.max(1, Math.min(st.requiredCount, approvers.length || 1));
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background pb-32">
      {/* Header */}
      <header className="border-b bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-30">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Approval Workflow Builder</h1>
              <p className="text-xs text-muted-foreground">
                Design multi-stage approval flows
              </p>
            </div>
          </div>
          <Badge variant={isValid ? "default" : "destructive"} className="gap-1">
            {isValid ? (
              <>
                <CheckCircle2 className="h-3 w-3" /> Ready
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3" /> {issues.length} issue{issues.length > 1 ? "s" : ""}
              </>
            )}
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pt-8">
        {/* Request name */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <label className="text-sm font-medium text-foreground">Request Name</label>
            <Input
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Ex: Salary Adjustment Request"
              className="mt-2 h-11 text-base"
            />
          </CardContent>
        </Card>

        {/* Stages timeline */}
        <div className="relative">
          {/* vertical guide line */}
          <div
            className="absolute left-6 top-2 bottom-2 w-px bg-border"
            aria-hidden
          />

          {stages.map((stage, index) => {
            const stageIssues = issuesByStage.get(stage.id) ?? [];
            const hasIssue = stageIssues.length > 0;
            const isEffectivelyAll =
              stage.mode === "Group" &&
              !stage.allRequired &&
              stage.requiredCount >= stage.approvers.length;
            return (
              <div key={stage.id} className="relative pl-16 pb-6">
                {/* node */}
                <div
                  className={cn(
                    "absolute left-0 top-4 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-card shadow-sm font-semibold",
                    hasIssue
                      ? "border-destructive text-destructive"
                      : "border-primary text-primary",
                  )}
                >
                  {index + 1}
                </div>

                <Card
                  className={cn(
                    "transition-shadow hover:shadow-md",
                    hasIssue && "border-destructive/50",
                  )}
                >
                  <CardContent className="p-5">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <Badge variant="secondary" className="gap-1">
                        <Flag className="h-3 w-3" /> Stage {index + 1}
                      </Badge>
                      <Input
                        value={stage.name}
                        onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                        placeholder="Stage name"
                        className="h-9 max-w-xs flex-1 font-medium"
                      />
                      <div className="ml-auto" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStage(stage.id)}
                        disabled={stages.length === 1}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          Approval Type
                        </label>
                        <Select
                          value={stage.mode}
                          onValueChange={(v) => setMode(stage.id, v as Mode)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single">
                              <span className="flex items-center gap-2">
                                <User className="h-4 w-4" /> Single Approver
                              </span>
                            </SelectItem>
                            <SelectItem value="Group">
                              <span className="flex items-center gap-2">
                                <Users className="h-4 w-4" /> Group Approval
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {stage.mode === "Group" && (
                        <div>
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">
                            Required Approvals
                          </label>
                          <div className="space-y-2">
                            <div className="flex h-9 items-center gap-3 rounded-md border bg-background px-3">
                              <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
                                <Checkbox
                                  checked={stage.allRequired}
                                  onCheckedChange={(c) =>
                                    updateStage(stage.id, { allRequired: !!c })
                                  }
                                />
                                All Required
                              </label>
                              <span className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                                <input
                                  type="number"
                                  min={1}
                                  max={stage.approvers.length}
                                  value={stage.requiredCount}
                                  onChange={(e) =>
                                    updateStage(stage.id, {
                                      requiredCount: Math.max(
                                        1,
                                        Number(e.target.value) || 1,
                                      ),
                                    })
                                  }
                                  disabled={stage.allRequired}
                                  className={cn(
                                    "w-16 rounded-md border px-2 py-1 text-center text-sm outline-none transition",
                                    stage.allRequired
                                      ? "border-muted bg-muted text-muted-foreground cursor-not-allowed"
                                      : "border-input bg-background text-foreground focus:ring-1 focus:ring-ring",
                                  )}
                                />
                                <span>of {stage.approvers.length}</span>
                              </span>
                            </div>

                            {isEffectivelyAll && (
                              <div className="flex items-center gap-2 rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                                <Info className="h-4 w-4 shrink-0" />
                                <span>
                                  You require {stage.requiredCount} of {stage.approvers.length} — that's effectively all. Consider checking <strong>All Required</strong>.
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Approvers */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs font-medium text-muted-foreground">
                          Approvers ({stage.approvers.length})
                        </label>
                        {stage.mode === "Group" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addApprover(stage.id)}
                            disabled={stage.approvers.length >= people.length}
                          >
                            <Plus className="h-4 w-4" /> Add
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {stage.approvers.map((appr, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                              {appr.charAt(0)}
                            </div>
                            <Select
                              value={appr}
                              onValueChange={(v) => setApprover(stage.id, idx, v)}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {people.map((p) => (
                                  <SelectItem key={p} value={p}>
                                    {p}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {stage.mode === "Group" && stage.approvers.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => removeApprover(stage.id, idx)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {hasIssue && (
                      <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 p-3">
                        {stageIssues.map((iss, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-destructive"
                          >
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{iss.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {/* Ghost add card */}
          <div className="relative pl-16">
            <div className="absolute left-0 top-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 bg-card text-muted-foreground">
              <Plus className="h-5 w-5" />
            </div>
            <button
              onClick={addStage}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-card/30 px-5 py-8 text-sm font-medium text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-4 w-4 transition group-hover:scale-110" />
              Add Approval Stage
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <PreviewSection
            requestName={requestName}
            stages={stages}
            isValid={isValid}
          />
        )}
      </main>

      {/* Floating preview button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          onClick={() => setShowPreview((v) => !v)}
          disabled={!isValid}
          className="gap-2 rounded-full shadow-lg shadow-primary/25"
        >
          <Eye className="h-4 w-4" />
          {showPreview ? "Hide Preview" : "Preview Workflow"}
        </Button>
      </div>
    </div>
  );
}

function PreviewSection({
  requestName,
  stages,
  isValid,
}: {
  requestName: string;
  stages: Stage[];
  isValid: boolean;
}) {
  if (!isValid) return null;
  const title = requestName || "Untitled Request";

  return (
    <Card className="mt-10">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Workflow Preview</h2>
          <Badge variant="secondary" className="ml-auto">
            {stages.length} stage{stages.length > 1 ? "s" : ""}
          </Badge>
        </div>

        <div className="rounded-xl border bg-muted/30 p-6">
          {/* START */}
          <MilestoneNode
            icon={<CircleDot className="h-4 w-4" />}
            label="START"
            title={title}
            tone="start"
          />

          {stages.map((stage, i) => {
            const required =
              stage.mode === "Single"
                ? 1
                : stage.allRequired
                  ? stage.approvers.length
                  : stage.requiredCount;
            const total = stage.mode === "Single" ? 1 : stage.approvers.length;
            return (
              <div key={stage.id}>
                <Connector />
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{stage.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Stage {i + 1} of {stages.length}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="ml-auto gap-1"
                    >
                      {stage.mode === "Single" ? (
                        <>
                          <User className="h-3 w-3" /> Single Approver
                        </>
                      ) : (
                        <>
                          <Users className="h-3 w-3" /> {required}/{total} required
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 pl-10">
                    {stage.approvers.map((a, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-foreground/90"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary/60" />
                        <span>{a}</span>
                        {stage.mode === "Single" && (
                          <Badge variant="secondary" className="ml-1 text-[10px]">
                            must approve
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">
                    {stage.mode === "Single"
                      ? `Requires approval from ${stage.approvers[0]} to proceed.`
                      : stage.allRequired
                        ? `All ${total} approvers must approve to proceed.`
                        : `Any ${required} of ${total} approvers must approve to proceed.`}
                  </div>
                </div>
              </div>
            );
          })}

          <Connector />
          <MilestoneNode
            icon={<Flag className="h-4 w-4" />}
            label="END"
            title="Request Approved"
            tone="end"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MilestoneNode({
  icon,
  label,
  title,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  tone: "start" | "end";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border-2 px-4 py-3",
        tone === "start"
          ? "border-primary/40 bg-primary/5"
          : "border-emerald-500/40 bg-emerald-500/5",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-white",
          tone === "start" ? "bg-primary" : "bg-emerald-600",
        )}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="font-semibold">{title}</div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="h-5 w-5 text-muted-foreground/50" />
    </div>
  );
}
