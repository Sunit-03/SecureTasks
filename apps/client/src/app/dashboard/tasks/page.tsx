"use client";

import { TaskBoard } from "@/features/tasks/components/task-board";

export default function TasksPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-[var(--fg)]">Task board</h1>
        <p className="text-sm text-[var(--fg-muted)]">Drag a card between columns to update its status.</p>
      </div>
      <TaskBoard />
    </div>
  );
}
