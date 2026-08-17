"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Star, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  useCreateWorkflowState,
  useDeleteWorkflowState,
  useReorderWorkflowStates,
  useUpdateWorkflowState,
  useWorkflowStates,
} from "@/features/workflow-states/hooks/use-workflow-states";
import { StatusCategory } from "@/types/workflow-state.types";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS = [
  { value: "TODO" as const, label: "To Do" },
  { value: "IN_PROGRESS" as const, label: "In Progress" },
  { value: "DONE" as const, label: "Done" },
];

export function WorkflowEditorDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}) {
  const { data: states } = useWorkflowStates(projectId);
  const createState = useCreateWorkflowState(projectId);
  const updateState = useUpdateWorkflowState(projectId);
  const deleteState = useDeleteWorkflowState(projectId);
  const reorderStates = useReorderWorkflowStates(projectId);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<StatusCategory>("TODO");

  const ordered = [...(states ?? [])].sort((a, b) => a.order - b.order);

  const addState = () => {
    if (!newName.trim()) return;
    createState.mutate(
      { name: newName.trim(), category: newCategory },
      { onSuccess: () => setNewName("") },
    );
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= ordered.length) return;
    const ids = ordered.map((s) => s.id);
    [ids[index], ids[target]] = [ids[target] as string, ids[index] as string];
    reorderStates.mutate(ids);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader title={`Workflow — ${projectName}`} onClose={() => onOpenChange(false)} />
        <div className="space-y-2">
          {ordered.map((state, index) => (
            <div
              key={state.id}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-2"
            >
              <input
                type="color"
                value={state.color}
                onChange={(e) => updateState.mutate({ stateId: state.id, data: { color: e.target.value } })}
                className="h-7 w-7 shrink-0 cursor-pointer rounded border border-[var(--border)] bg-transparent p-0.5"
                aria-label="Status color"
              />
              <Input
                defaultValue={state.name}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (value && value !== state.name) {
                    updateState.mutate({ stateId: state.id, data: { name: value } });
                  }
                }}
                className="h-8 flex-1"
              />
              <Select
                value={state.category}
                onChange={(category) => updateState.mutate({ stateId: state.id, data: { category } })}
                options={CATEGORY_OPTIONS}
                className="w-32"
              />
              <button
                onClick={() => updateState.mutate({ stateId: state.id, data: { isDefault: true } })}
                title={state.isDefault ? "Default status for new tasks" : "Set as default status"}
                className={cn(
                  "shrink-0 cursor-pointer rounded-md p-1.5",
                  state.isDefault
                    ? "text-[var(--warning)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--warning)]",
                )}
              >
                <Star className="h-3.5 w-3.5" fill={state.isDefault ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="shrink-0 cursor-pointer rounded-md p-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => move(index, 1)}
                disabled={index === ordered.length - 1}
                className="shrink-0 cursor-pointer rounded-md p-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => deleteState.mutate(state.id)}
                disabled={ordered.length <= 1}
                className="shrink-0 cursor-pointer rounded-md p-1.5 text-[var(--fg-muted)] hover:text-[var(--danger)] disabled:opacity-30"
                aria-label="Delete status"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2 border-t border-[var(--border)] pt-4">
          <Input
            placeholder="New status name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <Select
            value={newCategory}
            onChange={setNewCategory}
            options={CATEGORY_OPTIONS}
            className="w-32"
          />
          <Button size="sm" onClick={addState} disabled={!newName.trim()}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
