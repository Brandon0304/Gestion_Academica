import { describe, it, expect, vi } from 'vitest'
import { RefreshTokenUseCase } from './refresh-token.use-case.js'

const mockTokenService = {
  generateAccessToken: vi.fn().mockReturnValue('new-access-token'),
  generateRefreshToken: vi.fn().mockReturnValue('new-refresh-token'),
  verifyToken: vi.fn().mockReturnValue({ userId: 'u-1', email: 'test@test.com', role: 'admin' }),
}

describe('RefreshTokenUseCase', () => {
  it('should return a new token from refresh token', async () => {
    const useCase = new RefreshTokenUseCase(mockTokenService)

    const result = await useCase.execute({ refreshToken: 'valid-refresh-token' })

    expect(mockTokenService.verifyToken).toHaveBeenCalledWith('valid-refresh-token')
    expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith({
      userId: 'u-1',
      email: 'test@test.com',
      role: 'admin',
    })
    expect(result.token).toBe('new-access-token')
    expect(result.user).toEqual({
      id: 'u-1',
      email: 'test@test.com',
      role: 'admin',
    })
  })
})
