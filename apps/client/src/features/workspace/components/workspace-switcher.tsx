"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useWorkspaces, useCreateWorkspace } from "@/features/workspace/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher() {
  const { data: workspaces } = useWorkspaces();
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();
  const createWorkspace = useCreateWorkspace();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!activeWorkspaceId && workspaces && workspaces.length > 0) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [activeWorkspaceId, workspaces, setActiveWorkspaceId]);

  const active = workspaces?.find((w) => w.id === activeWorkspaceId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--fg)] cursor-pointer"
      >
        {active?.name ?? "Select workspace"}
        <ChevronDown className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-20 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl">
            {workspaces?.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  setActiveWorkspaceId(w.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium cursor-pointer hover:bg-[var(--surface-2)]",
                  w.id === activeWorkspaceId ? "text-[var(--accent)]" : "text-[var(--fg)]",
                )}
              >
                {w.name}
              </button>
            ))}
            <div className="my-1 h-px bg-[var(--border)]" />
            <button
              onClick={() => {
                const name = window.prompt("New workspace name");
                if (name && name.trim().length >= 3) {
                  createWorkspace.mutate(
                    { name: name.trim() },
                    { onSuccess: (ws) => setActiveWorkspaceId(ws.id) },
                  );
                }
                setOpen(false);
              }}
              className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> New workspace
            </button>
          </div>
        </>
      )}
    </div>
  );
}
