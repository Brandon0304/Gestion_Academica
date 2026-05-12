import type { UserRepository } from '../../../domain/repositories/user-repository.js'
import type { UserOutput, PaginatedOutput } from '../../dtos/user.js'

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(page: number, pageSize: number): Promise<PaginatedOutput<UserOutput>> {
    const { users, total } = await this.userRepository.findAll(page, pageSize)

    return {
      data: users.map((u) => ({
        id: u.id,
        email: u.email.toString(),
        role: u.role,
        isActive: u.isActive,
        lastLogin: u.lastLogin?.toISOString() ?? null,
        createdAt: u.createdAt.toISOString(),
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }
}
