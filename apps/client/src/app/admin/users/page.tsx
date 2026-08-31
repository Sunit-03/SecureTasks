"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { Pagination } from "@/components/admin/pagination";
import { useAdminUsers, useAdminWorkspaces } from "@/features/admin/hooks/use-admin";

const TABS = ["Users", "Workspaces"];

export default function AdminUsersPage() {
  const [tab, setTab] = useState<string>("Users");
  const [userPage, setUserPage] = useState(1);
  const [workspacePage, setWorkspacePage] = useState(1);

  const usersQuery = useAdminUsers(userPage);
  const workspacesQuery = useAdminWorkspaces(workspacePage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--fg)]">Users</h1>
          <p className="text-sm text-[var(--fg-muted)]">
            Every user and workspace on the platform, independent of your own membership.
          </p>
        </div>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === "Users" && (
        <Card className="overflow-hidden">
          {usersQuery.isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs text-[var(--fg-muted)]">
                    <th className="px-4 py-2.5 font-medium">Email</th>
                    <th className="px-4 py-2.5 font-medium">Role</th>
                    <th className="px-4 py-2.5 font-medium">Workspaces owned</th>
                    <th className="px-4 py-2.5 font-medium">Memberships</th>
                    <th className="px-4 py-2.5 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {usersQuery.data?.data.map((u) => (
                    <tr key={u.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-2.5 text-[var(--fg)]">{u.email}</td>
                      <td className="px-4 py-2.5">
                        <Badge tone={u.role === "ADMIN" ? "accent" : "neutral"}>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-2.5 text-[var(--fg-muted)]">{u._count.workspaces}</td>
                      <td className="px-4 py-2.5 text-[var(--fg-muted)]">{u._count.workspaceMembers}</td>
                      <td className="px-4 py-2.5 text-[var(--fg-muted)]">
                        {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 pb-4">
                <Pagination
                  page={usersQuery.data?.page ?? 1}
                  limit={usersQuery.data?.limit ?? 50}
                  total={usersQuery.data?.total ?? 0}
                  onPageChange={setUserPage}
                />
              </div>
            </>
          )}
        </Card>
      )}

      {tab === "Workspaces" && (
        <Card className="overflow-hidden">
          {workspacesQuery.isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs text-[var(--fg-muted)]">
                    <th className="px-4 py-2.5 font-medium">Name</th>
                    <th className="px-4 py-2.5 font-medium">Owner</th>
                    <th className="px-4 py-2.5 font-medium">Members</th>
                    <th className="px-4 py-2.5 font-medium">Projects</th>
                    <th className="px-4 py-2.5 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {workspacesQuery.data?.data.map((w) => (
                    <tr key={w.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-2.5 text-[var(--fg)]">{w.name}</td>
                      <td className="px-4 py-2.5 text-[var(--fg-muted)]">{w.owner.email}</td>
                      <td className="px-4 py-2.5 text-[var(--fg-muted)]">{w._count.members}</td>
                      <td className="px-4 py-2.5 text-[var(--fg-muted)]">{w._count.projects}</td>
                      <td className="px-4 py-2.5 text-[var(--fg-muted)]">
                        {formatDistanceToNow(new Date(w.createdAt), { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 pb-4">
                <Pagination
                  page={workspacesQuery.data?.page ?? 1}
                  limit={workspacesQuery.data?.limit ?? 50}
                  total={workspacesQuery.data?.total ?? 0}
                  onPageChange={setWorkspacePage}
                />
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
