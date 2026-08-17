"use client";

import { useDroppable } from "@dnd-kit/core";
import { Task } from "@/types/task.types";
import { WorkflowState } from "@/types/workflow-state.types";
import { TaskCard } from "@/features/tasks/components/task-card";
import { cn } from "@/lib/utils";

export function TaskColumn({
  state,
  tasks,
  draggable = true,
}: {
  state: WorkflowState;
  tasks: Task[];
  draggable?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: state.id, disabled: !draggable });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[200px] flex-col gap-2 rounded-2xl border border-dashed border-[var(--border)] p-3 transition-colors",
        isOver && "border-[var(--accent)] bg-[var(--accent)]/5",
      )}
    >
      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--fg)]">
          <span className="h-2 w-2 rounded-full" style={{ background: state.color }} />
          {state.name}
        </span>
        <span className="text-xs text-[var(--fg-muted)]">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.length === 0 && (
          <div className="rounded-xl border border-[var(--border)] p-4 text-center text-[11px] text-[var(--fg-muted)]">
            Drop a task here
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} draggable={draggable} />
        ))}
      </div>
    </div>
  );
}
