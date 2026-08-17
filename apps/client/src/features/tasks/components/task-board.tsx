"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Plus, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskColumn } from "@/features/tasks/components/task-column";
import { NewTaskDialog } from "@/features/tasks/components/new-task-dialog";
import { useTasks, useUpdateTask } from "@/features/tasks/hooks/use-tasks";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useWorkflowStates } from "@/features/workflow-states/hooks/use-workflow-states";
import { WorkflowEditorDialog } from "@/features/workflow-states/components/workflow-editor-dialog";
import { useMyWorkspaceRole } from "@/features/workspace/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";

export function TaskBoard() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const { data: projects, isLoading: projectsLoading } = useProjects(activeWorkspaceId);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const projectId = selectedProjectId ?? projects?.[0]?.id ?? null;

  const { data: states, isLoading: statesLoading } = useWorkflowStates(projectId);
  const { data: tasks, isLoading: tasksLoading } = useTasks(projectId);
  const updateTask = useUpdateTask();
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const myRole = useMyWorkspaceRole(activeWorkspaceId);
  const canEdit = myRole !== null && myRole !== "VIEWER";
  const isOwner = myRole === "OWNER";

  if (!activeWorkspaceId) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--fg-muted)]">
        Select a workspace from the top bar to see its task board.
      </div>
    );
  }

  if (!projectsLoading && (projects ?? []).length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--fg-muted)]">
        No projects yet — create one from the Projects page first.
      </div>
    );
  }

  const orderedStates = [...(states ?? [])].sort((a, b) => a.order - b.order);
  const selectedProject = projects?.find((p) => p.id === projectId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStatusId = over.id as string;
    const task = tasks?.find((t) => t.id === active.id);
    if (task && task.statusId !== newStatusId) {
      updateTask.mutate({ id: task.id, data: { statusId: newStatusId } });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select
          value={projectId ?? ""}
          onChange={setSelectedProjectId}
          options={(projects ?? []).map((p) => ({ value: p.id, label: p.name }))}
          className="w-56"
        />
        <div className="flex items-center gap-2">
          {isOwner && projectId && (
            <Button size="sm" variant="outline" onClick={() => setWorkflowOpen(true)}>
              <Settings2 className="h-3.5 w-3.5" /> Edit workflow
            </Button>
          )}
          {canEdit && projectId && (
            <Button size="sm" onClick={() => setNewTaskOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> New task
            </Button>
          )}
        </div>
      </div>

      {statesLoading || tasksLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            className="grid grid-cols-1 gap-3"
            style={{ gridTemplateColumns: `repeat(${Math.max(orderedStates.length, 1)}, minmax(0, 1fr))` }}
          >
            {orderedStates.map((state) => (
              <TaskColumn
                key={state.id}
                state={state}
                tasks={(tasks ?? []).filter((t) => t.statusId === state.id)}
                draggable={canEdit}
              />
            ))}
          </div>
        </DndContext>
      )}

      {projectId && <NewTaskDialog open={newTaskOpen} onOpenChange={setNewTaskOpen} projectId={projectId} />}
      {projectId && selectedProject && (
        <WorkflowEditorDialog
          open={workflowOpen}
          onOpenChange={setWorkflowOpen}
          projectId={projectId}
          projectName={selectedProject.name}
        />
      )}
    </div>
  );
}
