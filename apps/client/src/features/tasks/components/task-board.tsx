"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskColumn } from "@/features/tasks/components/task-column";
import { NewTaskDialog } from "@/features/tasks/components/new-task-dialog";
import { useTasks, useUpdateTask } from "@/features/tasks/hooks/use-tasks";
import { useWorkspaceStore } from "@/store/workspace.store";
import { TaskStatus } from "@/types/task.types";

const COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export function TaskBoard() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const { data: tasks, isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  if (!activeWorkspaceId) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--fg-muted)]">
        Select a workspace from the top bar to see its task board.
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as TaskStatus;
    const task = tasks?.find((t) => t.id === active.id);
    if (task && task.status !== newStatus) {
      updateTask.mutate({ id: task.id, data: { status: newStatus } });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs text-[var(--fg-muted)]">
          <Search className="h-3.5 w-3.5" /> Filter by title...
        </div>
        <Button size="sm" onClick={() => setNewTaskOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> New task
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {COLUMNS.map((status) => (
              <TaskColumn
                key={status}
                status={status}
                tasks={(tasks ?? []).filter((t) => t.status === status)}
              />
            ))}
          </div>
        </DndContext>
      )}

      <NewTaskDialog open={newTaskOpen} onOpenChange={setNewTaskOpen} />
    </div>
  );
}
