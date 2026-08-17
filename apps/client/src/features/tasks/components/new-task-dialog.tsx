"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { useCreateTask } from "@/features/tasks/hooks/use-tasks";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { PRIORITY_SELECT_OPTIONS } from "@/features/tasks/constants";
import { useWorkspaceStore } from "@/store/workspace.store";

const schema = z.object({
  title: z.string().min(3, "Title is too short").max(100),
  description: z.string().max(10000).optional(),
  projectId: z.string().min(1, "Pick a project"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

type FormValues = z.infer<typeof schema>;

export function NewTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { activeWorkspaceId } = useWorkspaceStore();
  const { data: projects } = useProjects(activeWorkspaceId);
  const createTask = useCreateTask();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "MEDIUM", description: "" },
  });

  const onSubmit = (values: FormValues) => {
    createTask.mutate(values, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const projectOptions = (projects ?? []).map((p) => ({ value: p.id, label: p.name }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader title="New task" onClose={() => onOpenChange(false)} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Input placeholder="Task title" {...register("title")} />
            {errors.title && <p className="mt-1 text-xs text-[var(--danger)]">{errors.title.message}</p>}
          </div>
          <div>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Description (optional)"
                />
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={
                      projectOptions.length > 0
                        ? projectOptions
                        : [{ value: "", label: "No projects yet" }]
                    }
                    disabled={projectOptions.length === 0}
                  />
                )}
              />
              {errors.projectId && (
                <p className="mt-1 text-xs text-[var(--danger)]">{errors.projectId.message}</p>
              )}
            </div>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange} options={PRIORITY_SELECT_OPTIONS} />
              )}
            />
          </div>
          {projects?.length === 0 && (
            <p className="text-xs text-[var(--fg-muted)]">
              No projects yet — create one from the Projects page first.
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Create task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
