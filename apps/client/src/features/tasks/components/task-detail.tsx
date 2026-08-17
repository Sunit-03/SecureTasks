"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Trash2, Clock, UserRound, CheckSquare, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RichTextEditor, sanitizeRichText } from "@/components/ui/rich-text-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteTask, useTask, useUpdateTask } from "@/features/tasks/hooks/use-tasks";
import { useWorkspaceMembers } from "@/features/workspace/hooks/use-workspaces";
import {
  PRIORITY_BADGE_TONE,
  PRIORITY_SELECT_OPTIONS,
  STATUS_BADGE_TONE,
  STATUS_SELECT_OPTIONS,
} from "@/features/tasks/constants";
import { useAuthStore } from "@/store/auth.store";
import { TaskPriority, TaskStatus } from "@/types/task.types";

export function TaskDetail({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: task, isLoading } = useTask(id);
  const { data: members } = useWorkspaceMembers(task?.project?.workspaceId ?? null);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [loadedTaskId, setLoadedTaskId] = useState<string | null>(null);

  if (task && task.id !== loadedTaskId) {
    setLoadedTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description ?? "");
  }

  if (isLoading || !task) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 lg:col-span-2" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  const saveTitle = () => {
    if (title.trim() && title !== task.title) {
      updateTask.mutate({ id: task.id, data: { title: title.trim() } });
    }
  };

  const isCreator = task.createdById === user?.id;
  const isWorkspaceOwner = members?.some((m) => m.userId === user?.id && m.role === "OWNER") ?? false;
  const canEditDescription = isCreator || isWorkspaceOwner;

  const saveDescription = () => {
    if (canEditDescription && description !== (task.description ?? "")) {
      updateTask.mutate({ id: task.id, data: { description } });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card>
          <CardContent className="space-y-3 p-5">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              className="h-auto border-none bg-transparent p-0 text-lg font-semibold focus:border-none"
            />
            {canEditDescription ? (
              <RichTextEditor
                value={description}
                onChange={setDescription}
                onBlur={saveDescription}
                placeholder="Add a description..."
              />
            ) : description ? (
              <div
                className="min-h-24 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--fg)] opacity-90 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(description) }}
              />
            ) : (
              <div className="min-h-24 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--fg-muted)]">
                No description yet.
              </div>
            )}
            {!canEditDescription && (
              <p className="text-xs text-[var(--fg-muted)]">
                Only the task creator or the workspace owner can edit the description.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5" /> Subtasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[var(--fg-muted)]">
              Subtasks aren&apos;t available yet — this section is a placeholder for a future release.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[var(--fg-muted)]">
              Comments aren&apos;t available yet — this section is a placeholder for a future release.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card style={{ background: "color-mix(in srgb, var(--warning) 10%, var(--surface))" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--warning)]" /> AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[var(--fg-muted)]">
            AI-generated summaries are coming soon.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Select
              value={task.status}
              onChange={(status: TaskStatus) => updateTask.mutate({ id: task.id, data: { status } })}
              options={STATUS_SELECT_OPTIONS}
            />
            <Badge tone={STATUS_BADGE_TONE[task.status]}>{task.status.replace("_", " ")}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5" /> Priority
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Select
              value={task.priority}
              onChange={(priority: TaskPriority) =>
                updateTask.mutate({ id: task.id, data: { priority } })
              }
              options={PRIORITY_SELECT_OPTIONS}
            />
            <Badge tone={PRIORITY_BADGE_TONE[task.priority]}>{task.priority}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5" /> Assignee
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[var(--fg-muted)]">Unassigned</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Time tracked
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[var(--fg-muted)]">Not tracked yet</CardContent>
        </Card>

        <Button
          variant="danger"
          size="sm"
          className="w-full"
          onClick={() =>
            deleteTask.mutate(task.id, { onSuccess: () => router.push("/dashboard/tasks") })
          }
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete task
        </Button>
      </div>
    </div>
  );
}
