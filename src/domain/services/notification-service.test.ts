import { describe, it, expect, vi } from 'vitest'
import { NotificationService } from './notification-service.js'
import type { EmailSender } from '../../application/ports/email-sender.js'

describe('NotificationService', () => {
  it('should notify enrollment', async () => {
    const sender: EmailSender = { send: vi.fn().mockResolvedValue(undefined) }
    const service = new NotificationService(sender)

    await service.notifyEnrollment('student@test.com', 'Ana', 'Programación I')

    expect(sender.send).toHaveBeenCalledWith(
      'student@test.com',
      'Inscripción Confirmada - G_Académica',
      expect.stringContaining('Ana'),
    )
    expect(sender.send).toHaveBeenCalledWith(
      'student@test.com',
      expect.any(String),
      expect.stringContaining('Programación I'),
    )
  })

  it('should notify grade', async () => {
    const sender: EmailSender = { send: vi.fn().mockResolvedValue(undefined) }
    const service = new NotificationService(sender)

    await service.notifyGrade('student@test.com', 'Luis', 'Matemáticas', 18, 'Parcial')

    expect(sender.send).toHaveBeenCalledWith(
      'student@test.com',
      'Nueva Calificación - G_Académica',
      expect.stringContaining('Luis'),
    )
    expect(sender.send).toHaveBeenCalledWith(
      'student@test.com',
      expect.any(String),
      expect.stringContaining('Matemáticas'),
    )
    expect(sender.send).toHaveBeenCalledWith(
      'student@test.com',
      expect.any(String),
      expect.stringContaining('Parcial'),
    )
  })
})
