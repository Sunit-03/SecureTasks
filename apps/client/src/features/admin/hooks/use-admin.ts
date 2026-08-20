"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminAuditLog, getAdminUsers, getAdminWorkspaces } from "@/services/admin.service";

export const adminKeys = {
  users: (page: number) => ["admin", "users", page] as const,
  workspaces: (page: number) => ["admin", "workspaces", page] as const,
  auditLog: (page: number) => ["admin", "audit-log", page] as const,
};

export function useAdminUsers(page: number) {
  return useQuery({ queryKey: adminKeys.users(page), queryFn: () => getAdminUsers(page) });
}

export function useAdminWorkspaces(page: number) {
  return useQuery({ queryKey: adminKeys.workspaces(page), queryFn: () => getAdminWorkspaces(page) });
}

export function useAdminAuditLog(page: number) {
  return useQuery({ queryKey: adminKeys.auditLog(page), queryFn: () => getAdminAuditLog(page) });
}
