import { AdminRepository } from "../repositories/admin.repositories";

const adminRepository = new AdminRepository();

function parsePagination(query: { page?: string; limit?: string }) {
  const page = parseInt(query.page ?? "") || 1;
  const limit = Math.min(parseInt(query.limit ?? "") || 50, 100);
  return { page, limit };
}

export class AdminService {
  async listUsers(query: { page?: string; limit?: string }) {
    const { page, limit } = parsePagination(query);

    const [users, total] = await Promise.all([
      adminRepository.findAllUsers({ page, limit }),
      adminRepository.countUsers(),
    ]);

    return { users, total, page, limit };
  }

  async listWorkspaces(query: { page?: string; limit?: string }) {
    const { page, limit } = parsePagination(query);

    const [workspaces, total] = await Promise.all([
      adminRepository.findAllWorkspaces({ page, limit }),
      adminRepository.countWorkspaces(),
    ]);

    return { workspaces, total, page, limit };
  }

  async listAuditLog(query: { page?: string; limit?: string }) {
    const { page, limit } = parsePagination(query);

    const [entries, total] = await Promise.all([
      adminRepository.findGlobalAuditLog({ page, limit }),
      adminRepository.countAuditLog(),
    ]);

    return { entries, total, page, limit };
  }
}
