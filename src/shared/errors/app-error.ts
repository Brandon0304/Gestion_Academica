export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: { field: string; message: string }[]

  constructor(code: string, message: string, statusCode: number, details?: { field: string; message: string }[]) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.name = this.constructor.name
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: { field: string; message: string }[]) {
    super('VALIDATION_ERROR', message, 400, details)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} no encontrado`, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: { field: string; message: string }[]) {
    super('CONFLICT', message, 409, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') {
    super('UNAUTHORIZED', message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Sin permisos suficientes') {
    super('FORBIDDEN', message, 403)
  }
}
