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
import { PRIORITY_SELECT_OPTIONS } from "@/features/tasks/constants";

const schema = z.object({
  title: z.string().min(3, "Title is too short").max(100),
  description: z.string().max(10000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

type FormValues = z.infer<typeof schema>;

export function NewTaskDialog({
  open,
  onOpenChange,
  projectId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}) {
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
    createTask.mutate(
      { ...values, projectId },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

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
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onChange={field.onChange} options={PRIORITY_SELECT_OPTIONS} />
            )}
          />
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
