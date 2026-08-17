"use client";

import Link from "next/link";
import { Sparkles, Users, CalendarDays, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useWorkspaceMembers } from "@/features/workspace/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useAuthStore } from "@/store/auth.store";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { activeWorkspaceId } = useWorkspaceStore();
  const { data: tasks, isLoading } = useTasks();
  const { data: members } = useWorkspaceMembers(activeWorkspaceId);

  const focusTasks = (tasks ?? [])
    .filter((t) => t.status.category !== "DONE")
    .slice(0, 4);

  const recentTasks = [...(tasks ?? [])]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-[var(--fg)]">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">Here&apos;s what&apos;s happening across your workspace.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today&apos;s Focus</CardTitle>
            <Link href="/dashboard/tasks" className="text-xs font-medium text-[var(--accent)]">
              View board
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading && <Skeleton className="h-32 w-full" />}
            {!isLoading && focusTasks.length === 0 && (
              <p className="py-6 text-center text-xs text-[var(--fg-muted)]">
                Nothing on your plate right now. Create a task to get started.
              </p>
            )}
            {focusTasks.map((task) => (
              <Link
                key={task.id}
                href={`/dashboard/tasks/${task.id}`}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 hover:border-[var(--accent)]"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[var(--fg)]">{task.title}</div>
                  {task.project && (
                    <div className="truncate text-xs text-[var(--fg-muted)]">{task.project.name}</div>
                  )}
                </div>
                <Badge style={{ background: `${task.status.color}26`, color: task.status.color }}>
                  {task.status.name}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card style={{ background: "color-mix(in srgb, var(--warning) 10%, var(--surface))" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--warning)]" /> AI Suggests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[var(--fg-muted)]">
            <p>Group similar backlog tasks into a sprint before Friday.</p>
            <p>2 tasks look blocked — check in with the assignee.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sprint Health</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div
              className="h-10 w-10 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(var(--accent) 72%, var(--surface-2) 0)`,
              }}
            />
            <span className="text-xs text-[var(--fg-muted)]">72% on track this sprint</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[var(--fg-muted)]">
            Due-date tracking is coming soon.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Team Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {members && members.length > 0 ? (
              <div className="flex -space-x-2">
                {members.slice(0, 6).map((m) => (
                  <Avatar key={m.id} label={m.user.email} className="ring-2 ring-[var(--surface)]" />
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--fg-muted)]">Select a workspace to see teammates.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentTasks.length === 0 && (
            <p className="text-xs text-[var(--fg-muted)]">No activity yet.</p>
          )}
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between text-xs">
              <span className="truncate text-[var(--fg)]">{task.title}</span>
              <span className="shrink-0 text-[var(--fg-muted)]">
                {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
