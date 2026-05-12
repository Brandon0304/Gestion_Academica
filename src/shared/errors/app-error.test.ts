import { describe, it, expect } from 'vitest'
import { AppError, ValidationError, NotFoundError, ConflictError, UnauthorizedError, ForbiddenError } from './index.js'

describe('AppError', () => {
  it('should create base error with correct properties', () => {
    const error = new AppError('TEST_ERROR', 'Test message', 400)
    expect(error.code).toBe('TEST_ERROR')
    expect(error.message).toBe('Test message')
    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('AppError')
  })

  it('should create ValidationError with 400 status', () => {
    const error = new ValidationError('Invalid data', [{ field: 'email', message: 'Invalid email' }])
    expect(error.statusCode).toBe(400)
    expect(error.code).toBe('VALIDATION_ERROR')
    expect(error.details).toHaveLength(1)
  })

  it('should create NotFoundError with 404 status', () => {
    const error = new NotFoundError('Student')
    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('Student no encontrado')
  })

  it('should create ConflictError with 409 status', () => {
    const error = new ConflictError('Schedule conflict')
    expect(error.statusCode).toBe(409)
    expect(error.code).toBe('CONFLICT')
  })

  it('should create UnauthorizedError with 401 status', () => {
    const error = new UnauthorizedError()
    expect(error.statusCode).toBe(401)
  })

  it('should create ForbiddenError with 403 status', () => {
    const error = new ForbiddenError()
    expect(error.statusCode).toBe(403)
  })
})
