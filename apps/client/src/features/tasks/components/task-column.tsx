"use client";

import { useDroppable } from "@dnd-kit/core";
import { Task, TaskStatus } from "@/types/task.types";
import { TaskCard } from "@/features/tasks/components/task-card";
import { cn } from "@/lib/utils";

const COLUMN_LABEL: Record<TaskStatus, string> = {
  TODO: "Backlog",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function TaskColumn({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[200px] flex-col gap-2 rounded-2xl border border-dashed border-[var(--border)] p-3 transition-colors",
        isOver && "border-[var(--accent)] bg-[var(--accent)]/5",
      )}
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-[var(--fg)]">{COLUMN_LABEL[status]}</span>
        <span className="text-xs text-[var(--fg-muted)]">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.length === 0 && (
          <div className="rounded-xl border border-[var(--border)] p-4 text-center text-[11px] text-[var(--fg-muted)]">
            Drop a task here
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
