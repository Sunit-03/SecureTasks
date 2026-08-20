import { api } from "@/lib/api";
import { AdminAuditLogEntry, AdminPaginated, AdminUser, AdminWorkspace } from "@/types/admin.types";

export const getAdminUsers = async (page = 1, limit = 50): Promise<AdminPaginated<AdminUser>> => {
  const response = await api.get("/admin/users", { params: { page, limit } });
  return response.data;
};

export const getAdminWorkspaces = async (
  page = 1,
  limit = 50,
): Promise<AdminPaginated<AdminWorkspace>> => {
  const response = await api.get("/admin/workspaces", { params: { page, limit } });
  return response.data;
};

export const getAdminAuditLog = async (
  page = 1,
  limit = 50,
): Promise<AdminPaginated<AdminAuditLogEntry>> => {
  const response = await api.get("/admin/audit-log", { params: { page, limit } });
  return response.data;
};
