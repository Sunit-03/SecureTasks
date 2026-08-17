"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TaskDetail } from "@/features/tasks/components/task-detail";

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/tasks"
        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to board
      </Link>
      <TaskDetail id={id} />
    </div>
  );
}
