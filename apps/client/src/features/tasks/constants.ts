import { SelectOption } from "@/components/ui/select";
import { TaskPriority, TaskStatus } from "@/types/task.types";

export const STATUS_SELECT_OPTIONS: SelectOption<TaskStatus>[] = [
  { value: "TODO", label: "To do", color: "var(--fg-muted)" },
  { value: "IN_PROGRESS", label: "In progress", color: "var(--accent)" },
  { value: "DONE", label: "Done", color: "var(--success)" },
];

export const PRIORITY_SELECT_OPTIONS: SelectOption<TaskPriority>[] = [
  { value: "LOW", label: "Low", color: "var(--fg-muted)" },
  { value: "MEDIUM", label: "Medium", color: "var(--warning)" },
  { value: "HIGH", label: "High", color: "var(--highlight)" },
  { value: "URGENT", label: "Urgent", color: "var(--danger)" },
];

export const STATUS_BADGE_TONE: Record<TaskStatus, "neutral" | "accent" | "success"> = {
  TODO: "neutral",
  IN_PROGRESS: "accent",
  DONE: "success",
};

export const PRIORITY_BADGE_TONE: Record<
  TaskPriority,
  "neutral" | "warning" | "highlight" | "danger"
> = {
  LOW: "neutral",
  MEDIUM: "warning",
  HIGH: "highlight",
  URGENT: "danger",
};
