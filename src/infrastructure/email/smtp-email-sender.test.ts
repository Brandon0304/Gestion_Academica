import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockTransporter = { sendMail: vi.fn().mockResolvedValue({ messageId: 'abc' }) }

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => mockTransporter),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  delete process.env['SMTP_HOST']
  delete process.env['SMTP_USER']
  delete process.env['SMTP_PASS']
  delete process.env['SMTP_FROM']
})

describe('SmtpEmailSender', () => {
  it('should log warning when SMTP_HOST is not set', async () => {
    const { SmtpEmailSender } = await import('./smtp-email-sender.js')
    const sender = new SmtpEmailSender()
    const result = sender.send('test@test.com', 'Subject', 'Body')
    await expect(result).resolves.toBeUndefined()
  })

  it('should send email via nodemailer when SMTP_HOST is set', async () => {
    process.env['SMTP_HOST'] = 'smtp.example.com'
    process.env['SMTP_USER'] = 'user'
    process.env['SMTP_PASS'] = 'pass'

    const { SmtpEmailSender } = await import('./smtp-email-sender.js')
    const sender = new SmtpEmailSender()
    await sender.send('user@test.com', 'Hello', 'Body text')

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'noreply@academia.edu',
      to: 'user@test.com',
      subject: 'Hello',
      text: 'Body text',
    })
  })

  it('should use custom SMTP_FROM when set', async () => {
    process.env['SMTP_HOST'] = 'smtp.example.com'
    process.env['SMTP_FROM'] = 'custom@academia.edu'

    const { SmtpEmailSender } = await import('./smtp-email-sender.js')
    const sender = new SmtpEmailSender()
    await sender.send('user@test.com', 'Test', 'Body')

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'custom@academia.edu' }),
    )
  })
})
