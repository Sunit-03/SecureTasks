"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Task } from "@/types/task.types";
import { Badge } from "@/components/ui/badge";
import { richTextToPlainText } from "@/components/ui/rich-text-editor";
import { PRIORITY_BADGE_TONE } from "@/features/tasks/constants";
import { cn } from "@/lib/utils";

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const descriptionPreview = task.description ? richTextToPlainText(task.description) : "";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        "group flex items-start gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 transition-shadow",
        isDragging && "opacity-40",
      )}
    >
      <button
        {...listeners}
        {...attributes}
        className="mt-0.5 cursor-grab text-[var(--fg-muted)] opacity-0 group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <Link href={`/dashboard/tasks/${task.id}`} className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="truncate text-sm font-medium text-[var(--fg)]">{task.title}</div>
          <Badge tone={PRIORITY_BADGE_TONE[task.priority]} className="shrink-0">
            {task.priority}
          </Badge>
        </div>
        {descriptionPreview && (
          <p className="mt-1 line-clamp-2 text-xs text-[var(--fg-muted)]">{descriptionPreview}</p>
        )}
        {task.project && (
          <span className="mt-2 inline-block rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--fg-muted)]">
            {task.project.name}
          </span>
        )}
      </Link>
    </div>
  );
}
