"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  useAddWorkspaceMember,
  useCreateWorkspace,
  useWorkspaceMembers,
  useWorkspaces,
} from "@/features/workspace/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { cn } from "@/lib/utils";

const workspaceSchema = z.object({ name: z.string().min(3).max(100) });
const memberSchema = z.object({ email: z.string().email(), role: z.enum(["ADMIN", "MEMBER"]) });

export default function WorkspacesPage() {
  const { data: workspaces } = useWorkspaces();
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();
  const createWorkspace = useCreateWorkspace();
  const { data: members } = useWorkspaceMembers(activeWorkspaceId);
  const addMember = useAddWorkspaceMember(activeWorkspaceId ?? "");

  const [creating, setCreating] = useState(false);
  const workspaceForm = useForm<{ name: string }>({ resolver: zodResolver(workspaceSchema) });
  const memberForm = useForm<{ email: string; role: "ADMIN" | "MEMBER" }>({
    resolver: zodResolver(memberSchema),
    defaultValues: { role: "MEMBER" },
  });

  const roleOptions = [
    { value: "MEMBER" as const, label: "Member" },
    { value: "ADMIN" as const, label: "Admin" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Workspaces</CardTitle>
          <Button size="sm" variant="ghost" onClick={() => setCreating((v) => !v)}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {creating && (
            <form
              className="flex gap-2"
              onSubmit={workspaceForm.handleSubmit((values) => {
                createWorkspace.mutate(values, {
                  onSuccess: (ws) => {
                    setActiveWorkspaceId(ws.id);
                    workspaceForm.reset();
                    setCreating(false);
                  },
                });
              })}
            >
              <Input placeholder="Workspace name" {...workspaceForm.register("name")} />
              <Button size="sm" type="submit">
                Add
              </Button>
            </form>
          )}
          {workspaces?.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveWorkspaceId(w.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm cursor-pointer",
                w.id === activeWorkspaceId
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
              )}
            >
              {w.name}
              {w.id === activeWorkspaceId && <Badge tone="accent">Active</Badge>}
            </button>
          ))}
          {workspaces?.length === 0 && (
            <p className="text-xs text-[var(--fg-muted)]">No workspaces yet — create one above.</p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!activeWorkspaceId ? (
            <p className="text-xs text-[var(--fg-muted)]">Select a workspace to see its members.</p>
          ) : (
            <>
              <form
                className="flex flex-wrap gap-2"
                onSubmit={memberForm.handleSubmit((values) => {
                  addMember.mutate(values, { onSuccess: () => memberForm.reset() });
                })}
              >
                <Input
                  className="flex-1 min-w-[180px]"
                  placeholder="teammate@company.com"
                  {...memberForm.register("email")}
                />
                <Controller
                  name="role"
                  control={memberForm.control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={field.onChange}
                      options={roleOptions}
                      className="w-32"
                    />
                  )}
                />
                <Button size="sm" type="submit">
                  <UserPlus className="h-3.5 w-3.5" /> Invite
                </Button>
              </form>

              <div className="space-y-2">
                {members?.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2">
                    <Avatar label={m.user.email} />
                    <span className="flex-1 truncate text-sm text-[var(--fg)]">{m.user.email}</span>
                    <Badge tone={m.role === "OWNER" ? "accent" : "neutral"}>{m.role}</Badge>
                  </div>
                ))}
                {members?.length === 0 && (
                  <p className="text-xs text-[var(--fg-muted)]">No members yet.</p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
