import { SelectOption } from "@/components/ui/select";
import { TaskPriority } from "@/types/task.types";

export const PRIORITY_SELECT_OPTIONS: SelectOption<TaskPriority>[] = [
  { value: "LOW", label: "Low", color: "var(--fg-muted)" },
  { value: "MEDIUM", label: "Medium", color: "var(--warning)" },
  { value: "HIGH", label: "High", color: "var(--highlight)" },
  { value: "URGENT", label: "Urgent", color: "var(--danger)" },
];

export const PRIORITY_BADGE_TONE: Record<
  TaskPriority,
  "neutral" | "warning" | "highlight" | "danger"
> = {
  LOW: "neutral",
  MEDIUM: "warning",
  HIGH: "highlight",
  URGENT: "danger",
};
