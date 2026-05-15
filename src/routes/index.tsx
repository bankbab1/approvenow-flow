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
  RotateCcw,
  GripVertical,
  Check,
  ChevronsUpDown,
  Search,
  Power,
  PowerOff,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
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
  active: boolean;
}

let nextId = 1;
const newStage = (): Stage => ({
  id: nextId++,
  name: "",
  mode: "Single",
  allRequired: true,
  requiredCount: 1,
  approvers: [""],
  active: true,
});

interface StageIssue {
  stageId: number;
  index: number;
  message: string;
}

function validate(stages: Stage[]): StageIssue[] {
  const issues: StageIssue[] = [];
  const activeStages = stages.filter((s) => s.active);
  if (activeStages.length === 0) {
    issues.push({
      stageId: -1,
      index: -1,
      message: "At least one stage must be active.",
    });
  }
  stages.forEach((s, i) => {
    if (!s.active) return;
    if (s.approvers.length === 0) {
      issues.push({ stageId: s.id, index: i, message: "No approvers added." });
    }
    if (s.approvers.some((a) => !a)) {
      issues.push({
        stageId: s.id,
        index: i,
        message: "Please specify approver for every slot.",
      });
    }
    const dup = new Set<string>();
    for (const a of s.approvers) {
      if (!a) continue;
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
    // cross-stage duplicates (only against other active stages, ignore empty)
    s.approvers.forEach((a) => {
      if (!a) return;
      const otherStageIdx = stages.findIndex(
        (other, j) => j !== i && other.active && other.approvers.includes(a),
      );
      if (otherStageIdx !== -1) {
        issues.push({
          stageId: s.id,
          index: i,
          message: `${a} is already used in Stage ${otherStageIdx + 1}.`,
        });
      }
    });
  });
  return issues;
}

const stagePlaceholders = [
  "e.g. Manager Review",
  "e.g. Department Approval",
  "e.g. Finance Sign-off",
  "e.g. Executive Approval",
  "e.g. Final Confirmation",
];

function Index() {
  const [requestName, setRequestName] = useState("");
  const [stages, setStages] = useState<Stage[]>(() => [newStage()]);
  const [showPreview, setShowPreview] = useState(false);
  const [countdown, setCountdown] = useState<Record<number, number>>({});
  const timersRef = useRef<Record<number, ReturnType<typeof setInterval>>>({});

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const updateStage = (id: number, patch: Partial<Stage>) =>
    setStages((s) => s.map((st) => (st.id === id ? { ...st, ...patch } : st)));

  const addStage = () => setStages((s) => [...s, newStage()]);

  const removeStage = (id: number) =>
    setStages((s) => s.filter((st) => st.id !== id));

  const resetAll = () => {
    Object.values(timersRef.current).forEach(clearInterval);
    timersRef.current = {};
    setCountdown({});
    setRequestName("");
    setStages([newStage()]);
    setShowPreview(false);
  };

  const addApprover = (id: number) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        const remaining =
          people.find((p) => !st.approvers.includes(p)) ?? people[0];
        const approvers = [...st.approvers, remaining];
        const requiredCount = st.allRequired ? approvers.length : st.requiredCount;
        return { ...st, approvers, requiredCount };
      }),
    );

  const removeApprover = (id: number, idx: number) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        const approvers = st.approvers.filter((_, i) => i !== idx);
        const requiredCount = st.allRequired
          ? approvers.length || 1
          : Math.max(1, Math.min(st.requiredCount, approvers.length || 1));
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
        return {
          ...st,
          mode,
          allRequired: true,
          requiredCount: st.approvers.length,
        };
      }),
    );

  const setAllRequired = (id: number, checked: boolean) =>
    setStages((s) =>
      s.map((st) => {
        if (st.id !== id) return st;
        if (checked) {
          return { ...st, allRequired: true, requiredCount: st.approvers.length };
        }
        const suggested = Math.max(1, st.approvers.length - 1);
        return { ...st, allRequired: false, requiredCount: suggested };
      }),
    );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setStages((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return items;
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // Auto-enable "All Required" 3s after a stage becomes effectively-all.
  useEffect(() => {
    stages.forEach((st) => {
      const effectivelyAll =
        st.mode === "Group" &&
        !st.allRequired &&
        st.approvers.length > 0 &&
        st.requiredCount >= st.approvers.length;

      if (effectivelyAll) {
        if (timersRef.current[st.id]) return;
        setCountdown((c) => ({ ...c, [st.id]: 3 }));
        timersRef.current[st.id] = setInterval(() => {
          setCountdown((c) => {
            const next = (c[st.id] ?? 3) - 1;
            if (next <= 0) {
              clearInterval(timersRef.current[st.id]);
              delete timersRef.current[st.id];
              setStages((prev) =>
                prev.map((p) =>
                  p.id === st.id
                    ? { ...p, allRequired: true, requiredCount: p.approvers.length }
                    : p,
                ),
              );
              const { [st.id]: _omit, ...rest } = c;
              return rest;
            }
            return { ...c, [st.id]: next };
          });
        }, 1000);
      } else if (timersRef.current[st.id]) {
        clearInterval(timersRef.current[st.id]);
        delete timersRef.current[st.id];
        setCountdown((c) => {
          const { [st.id]: _omit, ...rest } = c;
          return rest;
        });
      }
    });
    Object.keys(timersRef.current).forEach((k) => {
      const id = Number(k);
      if (!stages.find((s) => s.id === id)) {
        clearInterval(timersRef.current[id]);
        delete timersRef.current[id];
      }
    });
  }, [stages]);

  useEffect(
    () => () => {
      Object.values(timersRef.current).forEach(clearInterval);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background pb-32">
      <header className="border-b bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-30">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                Approval Workflow Builder
              </h1>
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
                <AlertTriangle className="h-3 w-3" /> {issues.length} issue
                {issues.length > 1 ? "s" : ""}
              </>
            )}
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pt-8">
        {/* Request Form Name */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-foreground">
                Request Form Name
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAll}
                className="text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
            <Input
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Ex: Salary Adjustment Request"
              className="h-11 text-base"
            />
          </CardContent>
        </Card>

        {/* Stages */}
        <div className="relative">
          <div
            className="absolute left-6 top-2 bottom-2 w-px bg-border"
            aria-hidden
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stages.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {stages.map((stage, index) => {
                const usedElsewhere = stages
                  .filter((s) => s.id !== stage.id)
                  .flatMap((s) => s.approvers);
                return (
                  <SortableStageCard
                    key={stage.id}
                    stage={stage}
                    index={index}
                    total={stages.length}
                    stageIssues={issuesByStage.get(stage.id) ?? []}
                    countdown={countdown[stage.id]}
                    usedElsewhere={usedElsewhere}
                    onUpdate={(p) => updateStage(stage.id, p)}
                    onRemove={() => removeStage(stage.id)}
                    onSetMode={(m) => setMode(stage.id, m)}
                    onSetAllRequired={(c) => setAllRequired(stage.id, c)}
                    onAddApprover={() => addApprover(stage.id)}
                    onRemoveApprover={(idx) => removeApprover(stage.id, idx)}
                    onSetApprover={(idx, v) => setApprover(stage.id, idx, v)}
                  />
                );
              })}
            </SortableContext>
          </DndContext>

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

        {showPreview && (
          <PreviewSection
            requestName={requestName}
            stages={stages}
            isValid={isValid}
          />
        )}
      </main>

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

interface SortableStageCardProps {
  stage: Stage;
  index: number;
  total: number;
  stageIssues: StageIssue[];
  countdown: number | undefined;
  usedElsewhere: string[];
  onUpdate: (patch: Partial<Stage>) => void;
  onRemove: () => void;
  onSetMode: (m: Mode) => void;
  onSetAllRequired: (c: boolean) => void;
  onAddApprover: () => void;
  onRemoveApprover: (idx: number) => void;
  onSetApprover: (idx: number, v: string) => void;
}

function SortableStageCard({
  stage,
  index,
  total,
  stageIssues,
  countdown,
  usedElsewhere,
  onUpdate,
  onRemove,
  onSetMode,
  onSetAllRequired,
  onAddApprover,
  onRemoveApprover,
  onSetApprover,
}: SortableStageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasIssue = stageIssues.length > 0;
  const isEffectivelyAll =
    stage.mode === "Group" &&
    !stage.allRequired &&
    stage.requiredCount >= stage.approvers.length;
  const placeholder =
    stagePlaceholders[index % stagePlaceholders.length] ?? "Stage name";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative pl-16 pb-6",
        isDragging && "z-20 opacity-90",
      )}
    >
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
          isDragging && "shadow-xl ring-2 ring-primary/40",
        )}
      >
        <CardContent className="p-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="flex h-8 w-6 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <Badge variant="secondary" className="gap-1">
              <Flag className="h-3 w-3" /> Stage {index + 1}
            </Badge>
            <Input
              value={stage.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder={placeholder}
              className="h-9 max-w-xs flex-1 font-medium"
            />
            <div className="ml-auto" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={total === 1}
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
                onValueChange={(v) => onSetMode(v as Mode)}
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
                    <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
                      <Checkbox
                        checked={stage.allRequired}
                        onCheckedChange={(c) => onSetAllRequired(!!c)}
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
                          onUpdate({
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
                            ? "cursor-not-allowed border-muted bg-muted text-muted-foreground"
                            : "border-input bg-background text-foreground focus:ring-1 focus:ring-ring",
                        )}
                      />
                      <span>of {stage.approvers.length}</span>
                    </span>
                  </div>

                  {isEffectivelyAll && (
                    <div className="flex items-start gap-2 rounded-md border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        Requiring {stage.requiredCount} of{" "}
                        {stage.approvers.length} is the same as{" "}
                        <strong>All Required</strong>.{" "}
                        {countdown != null
                          ? `Auto-enabling in ${countdown}s…`
                          : "Switching automatically…"}
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
                  onClick={onAddApprover}
                  disabled={stage.approvers.length >= people.length}
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {stage.approvers.map((appr, idx) => {
                const taken = [
                  ...stage.approvers.filter((_, i) => i !== idx),
                  ...usedElsewhere,
                ];
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {appr.charAt(0)}
                    </div>
                    <SearchableSelect
                      value={appr}
                      onChange={(v) => onSetApprover(idx, v)}
                      options={people}
                      disabledOptions={taken}
                      placeholder="Select approver"
                      className="flex-1"
                    />
                    {stage.mode === "Group" && stage.approvers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveApprover(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
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
}

interface SearchableSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabledOptions?: string[];
  placeholder?: string;
  className?: string;
}

function SearchableSelect({
  value,
  onChange,
  options,
  disabledOptions = [],
  placeholder = "Select…",
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-9 justify-between gap-2 px-3 font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <div className="flex items-center border-b px-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandInput
              placeholder="Search…"
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty>No match found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isDisabled = disabledOptions.includes(opt) && opt !== value;
                return (
                  <CommandItem
                    key={opt}
                    value={opt}
                    disabled={isDisabled}
                    onSelect={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === opt ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className={cn(isDisabled && "text-muted-foreground")}>
                      {opt}
                    </span>
                    {isDisabled && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        used
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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
            const stageName = stage.name.trim() || `Stage ${i + 1}`;
            return (
              <div key={stage.id}>
                <Connector />
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{stageName}</div>
                      <div className="text-xs text-muted-foreground">
                        Stage {i + 1} of {stages.length}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto gap-1">
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
                          <Badge
                            variant="secondary"
                            className="ml-1 text-[10px]"
                          >
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
