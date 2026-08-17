"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard, NewProjectTile } from "@/features/projects/components/project-card";
import { NewProjectDialog } from "@/features/projects/components/new-project-dialog";
import { useDeleteProject, useProjects } from "@/features/projects/hooks/use-projects";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useWorkspaces } from "@/features/workspace/hooks/use-workspaces";
import { formatDistanceToNow } from "date-fns";

export default function ProjectsPage() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const { data: workspaces } = useWorkspaces();
  const { data: projects, isLoading } = useProjects(activeWorkspaceId);
  const { data: tasks } = useTasks();
  const deleteProject = useDeleteProject(activeWorkspaceId ?? "");
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const taskCountFor = (projectId: string) =>
    (tasks ?? []).filter((t) => t.projectId === projectId).length;

  if (!activeWorkspaceId) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-[var(--fg-muted)]">
          {workspaces && workspaces.length === 0
            ? "You don't have a workspace yet — create one from the Workspaces page."
            : "Select a workspace from the top bar to see its projects."}
        </CardContent>
      </Card>
    );
  }

  const [hero, ...rest] = projects ?? [];
  const recentTasks = [...(tasks ?? [])]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--fg)]">Projects</h1>
          <p className="text-sm text-[var(--fg-muted)]">
            {projects?.length ?? 0} project{projects?.length === 1 ? "" : "s"} in this workspace
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Skeleton className="h-40 sm:col-span-2" />
          <Skeleton className="h-40" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <ProjectCard
              project={hero}
              taskCount={taskCountFor(hero.id)}
              variant="hero"
              onDelete={() => deleteProject.mutate(hero.id)}
            />
          </div>
          <div className="flex flex-col gap-3">
            {rest.slice(0, 3).map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                taskCount={taskCountFor(p.id)}
                onDelete={() => deleteProject.mutate(p.id)}
              />
            ))}
            <NewProjectTile onClick={() => setNewProjectOpen(true)} />
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-sm text-[var(--fg-muted)]">
            No projects yet.
            <div className="mt-3">
              <NewProjectTile onClick={() => setNewProjectOpen(true)} />
            </div>
          </CardContent>
        </Card>
      )}

      {rest.length > 3 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {rest.slice(3).map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              taskCount={taskCountFor(p.id)}
              onDelete={() => deleteProject.mutate(p.id)}
            />
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentTasks.length === 0 && (
            <p className="text-xs text-[var(--fg-muted)]">No activity yet.</p>
          )}
          {recentTasks.map((task) => (
            <Link
              key={task.id}
              href={`/dashboard/tasks/${task.id}`}
              className="flex items-center justify-between text-xs hover:text-[var(--accent)]"
            >
              <span className="truncate text-[var(--fg)]">{task.title}</span>
              <span className="shrink-0 text-[var(--fg-muted)]">
                {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>

      <NewProjectDialog
        open={newProjectOpen}
        onOpenChange={setNewProjectOpen}
        workspaceId={activeWorkspaceId}
      />
    </div>
  );
}
