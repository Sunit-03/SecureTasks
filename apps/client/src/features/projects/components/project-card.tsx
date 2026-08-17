"use client";

import { Trash2 } from "lucide-react";
import { Project } from "@/types/project.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  taskCount,
  variant = "row",
  onDelete,
}: {
  project: Project;
  taskCount: number;
  variant?: "hero" | "row";
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-[var(--border)]",
        variant === "hero"
          ? "p-5"
          : "flex items-center justify-between p-3.5",
      )}
      style={
        variant === "hero"
          ? { background: "color-mix(in srgb, var(--accent) 10%, var(--surface))" }
          : { background: "var(--surface)" }
      }
    >
      <div className="min-w-0">
        <div className={cn("font-semibold text-[var(--fg)]", variant === "hero" ? "text-lg" : "text-sm")}>
          {project.name}
        </div>
        {project.description && (
          <p
            className={cn(
              "mt-1 text-[var(--fg-muted)]",
              variant === "hero" ? "text-sm line-clamp-2" : "hidden",
            )}
          >
            {project.description}
          </p>
        )}
        <div className="mt-2 text-xs text-[var(--fg-muted)]">
          {taskCount} {taskCount === 1 ? "task" : "tasks"}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-[var(--fg-muted)] opacity-0 hover:bg-[var(--surface-2)] hover:text-[var(--danger)] group-hover:opacity-100 cursor-pointer"
        aria-label="Delete project"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function NewProjectTile({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-full min-h-[64px] w-full justify-center border-dashed text-[var(--fg-muted)]"
    >
      + New project
    </Button>
  );
}
