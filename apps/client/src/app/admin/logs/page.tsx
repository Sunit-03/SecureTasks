"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/admin/pagination";
import { useAdminAuditLog } from "@/features/admin/hooks/use-admin";

export default function AdminLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminAuditLog(page);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-[var(--fg)]">Audit Log</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Every logged action across every workspace on the platform.
        </p>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs text-[var(--fg-muted)]">
                  <th className="px-4 py-2.5 font-medium">Action</th>
                  <th className="px-4 py-2.5 font-medium">Actor</th>
                  <th className="px-4 py-2.5 font-medium">Workspace</th>
                  <th className="px-4 py-2.5 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((entry) => (
                  <tr key={entry.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-2.5">
                      <Badge tone="accent">{entry.action}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-[var(--fg)]">{entry.user.email}</td>
                    <td className="px-4 py-2.5 text-[var(--fg-muted)]">
                      {entry.workspace?.name ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-[var(--fg-muted)]">
                      {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 pb-4">
              <Pagination
                page={data?.page ?? 1}
                limit={data?.limit ?? 50}
                total={data?.total ?? 0}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
