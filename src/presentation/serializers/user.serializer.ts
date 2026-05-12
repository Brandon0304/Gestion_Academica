import type { UserOutput } from '../../application/dtos/user.js'
import type { PaginatedOutput } from '../../application/dtos/student.js'

export function serializeUser(user: UserOutput) {
  return user
}

export function serializePaginatedUsers(result: PaginatedOutput<UserOutput>) {
  return result
}
