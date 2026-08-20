"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import AdminGuard from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/layout/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </ProtectedRoute>
  );
}
