import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api, setToken, clearToken, ApiRequestError } from './api'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('api', () => {
  const mockFetch = (status: number, body: unknown) => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
      statusText: status === 404 ? 'Not Found' : 'OK',
    })
  }

  describe('get', () => {
    it('should make GET request and return data', async () => {
      mockFetch(200, { id: '1', name: 'Test' })
      const result = await api.get('/test')
      expect(result).toEqual({ id: '1', name: 'Test' })
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/test'),
        expect.objectContaining({ method: 'GET' }),
      )
    })

    it('should attach auth token when available', async () => {
      setToken('my-token')
      mockFetch(200, {})
      await api.get('/test')
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer my-token' }),
        }),
      )
    })

    it('should throw ApiRequestError on failure', async () => {
      mockFetch(401, { error: { code: 'UNAUTHORIZED', message: 'No autorizado' } })
      await expect(api.get('/test')).rejects.toThrow(ApiRequestError)
      await expect(api.get('/test')).rejects.toThrow('No autorizado')
    })
  })

  describe('post', () => {
    it('should make POST request with body', async () => {
      mockFetch(201, { id: '1' })
      const result = await api.post('/test', { name: 'New' })
      expect(result).toEqual({ id: '1' })
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'New' }),
        }),
      )
    })
  })

  describe('put', () => {
    it('should make PUT request', async () => {
      mockFetch(200, { id: '1' })
      await api.put('/test/1', { name: 'Updated' })
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PUT' }),
      )
    })
  })

  describe('patch', () => {
    it('should make PATCH request', async () => {
      mockFetch(200, { id: '1' })
      await api.patch('/test/1', { name: 'Patched' })
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PATCH' }),
      )
    })
  })

  describe('delete', () => {
    it('should make DELETE request', async () => {
      mockFetch(204, undefined)
      const result = await api.delete('/test/1')
      expect(result).toBeUndefined()
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })

  describe('token management', () => {
    it('should set and clear tokens', () => {
      setToken('test-token')
      expect(localStorage.getItem('auth_token')).toBe('test-token')

      clearToken()
      expect(localStorage.getItem('auth_token')).toBeNull()
    })
  })
})
