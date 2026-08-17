"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  Sparkles,
  Trash2,
  Clock,
  UserRound,
  CheckSquare,
  Flag,
  MessageSquare,
  Link2,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { RichTextEditor, sanitizeRichText } from "@/components/ui/rich-text-editor";
import { Skeleton } from "@/components/ui/skeleton";
import {
  taskKeys,
  useDeleteTask,
  useTask,
  useTasks,
  useUpdateTask,
} from "@/features/tasks/hooks/use-tasks";
import { useComments, useCreateComment, useDeleteComment } from "@/features/tasks/hooks/use-comments";
import { useMyWorkspaceRole, useWorkspaceMembers } from "@/features/workspace/hooks/use-workspaces";
import {
  PRIORITY_BADGE_TONE,
  PRIORITY_SELECT_OPTIONS,
  STATUS_BADGE_TONE,
  STATUS_SELECT_OPTIONS,
} from "@/features/tasks/constants";
import { useAuthStore } from "@/store/auth.store";
import { Task, TaskPriority, TaskStatus } from "@/types/task.types";

const UNASSIGNED = "__unassigned__";

export function TaskDetail({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: task, isLoading } = useTask(id);
  const myRole = useMyWorkspaceRole(task?.project?.workspaceId ?? null);
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

  const isCreator = task.createdById === user?.id;
  const isOwner = myRole === "OWNER";
  const canEditContent = isCreator || isOwner;
  const canEditWorkflow = myRole !== null && myRole !== "VIEWER";
  const canDelete = myRole === "ADMIN" || myRole === "OWNER";

  const saveTitle = () => {
    if (canEditContent && title.trim() && title !== task.title) {
      updateTask.mutate({ id: task.id, data: { title: title.trim() } });
    }
  };

  const saveDescription = () => {
    if (canEditContent && description !== (task.description ?? "")) {
      updateTask.mutate({ id: task.id, data: { description } });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card>
          <CardContent className="space-y-3 p-5">
            {canEditContent ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle}
                className="h-auto border-none bg-transparent p-0 text-lg font-semibold focus:border-none"
              />
            ) : (
              <div className="text-lg font-semibold text-[var(--fg)]">{task.title}</div>
            )}
            {canEditContent ? (
              <RichTextEditor
                value={description}
                onChange={setDescription}
                onBlur={saveDescription}
                placeholder="Add a description..."
              />
            ) : task.description ? (
              <div
                className="min-h-24 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--fg)] opacity-90 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(task.description) }}
              />
            ) : (
              <div className="min-h-24 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--fg-muted)]">
                No description yet.
              </div>
            )}
            {!canEditContent && (
              <p className="text-xs text-[var(--fg-muted)]">
                Only the task creator or the workspace owner can edit the title or description.
              </p>
            )}
          </CardContent>
        </Card>

        <SubtasksCard task={task} canEdit={canEditWorkflow} />

        <CommentsCard taskId={task.id} myUserId={user?.id} myRole={myRole} />
      </div>

      <div className="space-y-4">
        <Card style={{ background: "color-mix(in srgb, var(--warning) 10%, var(--surface))" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--warning)]" /> AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[var(--fg-muted)]">
            AI-generated summaries are coming soon. Once available, an admin will be able to
            generate and approve a summary here for everyone to see.
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
              disabled={!canEditWorkflow}
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
              disabled={!canEditWorkflow}
            />
            <Badge tone={PRIORITY_BADGE_TONE[task.priority]}>{task.priority}</Badge>
          </CardContent>
        </Card>

        <AssigneeCard task={task} canEdit={canEditWorkflow} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Time tracked
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[var(--fg-muted)]">Not tracked yet</CardContent>
        </Card>

        {canDelete && (
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
        )}
      </div>
    </div>
  );
}

function AssigneeCard({ task, canEdit }: { task: Task; canEdit: boolean }) {
  const updateTask = useUpdateTask();
  const { data: members } = useWorkspaceMembers(task.project?.workspaceId ?? null);
  const options = [
    { value: UNASSIGNED, label: "Unassigned" },
    ...(members ?? []).map((m) => ({ value: m.userId, label: m.user.email })),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <UserRound className="h-3.5 w-3.5" /> Assignee
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={task.assigneeId ?? UNASSIGNED}
          onChange={(value) =>
            updateTask.mutate({
              id: task.id,
              data: { assigneeId: value === UNASSIGNED ? null : value },
            })
          }
          options={options}
          disabled={!canEdit}
        />
      </CardContent>
    </Card>
  );
}

function SubtasksCard({ task, canEdit }: { task: Task; canEdit: boolean }) {
  const queryClient = useQueryClient();
  const updateTask = useUpdateTask();
  const { data: allTasks } = useTasks();
  const [selected, setSelected] = useState("");

  const linkedIds = new Set((task.subtasks ?? []).map((s) => s.id));
  const candidates = (allTasks ?? []).filter(
    (candidate) =>
      candidate.id !== task.id &&
      !linkedIds.has(candidate.id) &&
      !candidate.parentTaskId &&
      candidate.id !== task.parentTaskId,
  );

  const linkSubtask = (childId: string) => {
    updateTask.mutate(
      { id: childId, data: { parentTaskId: task.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: taskKeys.detail(task.id) });
          setSelected("");
        },
      },
    );
  };

  const unlinkSubtask = (childId: string) => {
    updateTask.mutate(
      { id: childId, data: { parentTaskId: null } },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.detail(task.id) }),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <CheckSquare className="h-3.5 w-3.5" /> Subtasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.parentTask && (
          <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
            <Link2 className="h-3.5 w-3.5" />
            Subtask of{" "}
            <Link href={`/dashboard/tasks/${task.parentTask.id}`} className="text-[var(--accent)]">
              {task.parentTask.title}
            </Link>
          </div>
        )}

        {(task.subtasks ?? []).length === 0 ? (
          <p className="text-xs text-[var(--fg-muted)]">No subtasks linked yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {task.subtasks!.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
              >
                <Link href={`/dashboard/tasks/${s.id}`} className="min-w-0 flex-1 truncate text-[var(--fg)]">
                  {s.title}
                </Link>
                <Badge tone={STATUS_BADGE_TONE[s.status]}>{s.status.replace("_", " ")}</Badge>
                {canEdit && (
                  <button
                    onClick={() => unlinkSubtask(s.id)}
                    className="text-[var(--fg-muted)] hover:text-[var(--danger)] cursor-pointer"
                    aria-label="Unlink subtask"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {canEdit && candidates.length > 0 && (
          <div className="flex gap-2">
            <Select
              value={selected}
              onChange={setSelected}
              options={[
                { value: "", label: "Link an existing task..." },
                ...candidates.map((c) => ({ value: c.id, label: c.title })),
              ]}
              className="flex-1"
            />
            <Button size="sm" variant="outline" disabled={!selected} onClick={() => linkSubtask(selected)}>
              Link
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CommentsCard({
  taskId,
  myUserId,
  myRole,
}: {
  taskId: string;
  myUserId?: string;
  myRole: string | null;
}) {
  const { data: comments, isLoading } = useComments(taskId);
  const createComment = useCreateComment(taskId);
  const deleteComment = useDeleteComment(taskId);
  const [content, setContent] = useState("");
  const canPost = myRole !== null && myRole !== "VIEWER";
  const canModerate = myRole === "ADMIN" || myRole === "OWNER";

  const submit = () => {
    if (!content.trim()) return;
    createComment.mutate({ content: content.trim() }, { onSuccess: () => setContent("") });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5" /> Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-xs text-[var(--fg-muted)]">Loading comments...</p>}
        {!isLoading && (comments ?? []).length === 0 && (
          <p className="text-xs text-[var(--fg-muted)]">No comments yet.</p>
        )}
        <div className="space-y-2">
          {comments?.map((c) => (
            <div key={c.id} className="rounded-lg border border-[var(--border)] px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[var(--fg)]">{c.author.email}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[var(--fg-muted)]">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                  {(c.authorId === myUserId || canModerate) && (
                    <button
                      onClick={() => deleteComment.mutate(c.id)}
                      className="text-[var(--fg-muted)] hover:text-[var(--danger)] cursor-pointer"
                      aria-label="Delete comment"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm text-[var(--fg)]">{c.content}</p>
            </div>
          ))}
        </div>
        {canPost ? (
          <div className="space-y-2">
            <Textarea
              rows={2}
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button size="sm" onClick={submit} disabled={!content.trim() || createComment.isPending}>
              Post comment
            </Button>
          </div>
        ) : (
          <p className="text-xs text-[var(--fg-muted)]">Viewers can read comments but not post them.</p>
        )}
      </CardContent>
    </Card>
  );
}
