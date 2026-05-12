export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationResult {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export function buildPagination(page: number, pageSize: number, total: number): PaginationResult {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}
