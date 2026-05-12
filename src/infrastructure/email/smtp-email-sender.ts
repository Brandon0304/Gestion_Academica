import nodemailer from 'nodemailer'
import type { EmailSender } from '../../application/ports/email-sender.js'
import { logger } from '../logging/logger.js'

function config() {
  return {
    host: process.env['SMTP_HOST'] ?? '',
    port: Number(process.env['SMTP_PORT']) || 587,
    user: process.env['SMTP_USER'] ?? '',
    pass: process.env['SMTP_PASS'] ?? '',
    from: process.env['SMTP_FROM'] ?? 'noreply@academia.edu',
  }
}

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const c = config()
    transporter = nodemailer.createTransport({
      host: c.host,
      port: c.port,
      secure: c.port === 465,
      auth: c.user && c.pass ? { user: c.user, pass: c.pass } : undefined,
    })
  }
  return transporter
}

export class SmtpEmailSender implements EmailSender {
  async send(to: string, subject: string, body: string): Promise<void> {
    const c = config()

    if (!c.host) {
      logger.warn('SMTP_HOST not configured — falling back to console log')
      logger.info({ to, subject }, `[EMAIL] To: ${to} | Subject: ${subject} | Body: ${body.substring(0, 200)}...`)
      return
    }

    try {
      const tr = getTransporter()
      await tr.sendMail({
        from: c.from,
        to,
        subject,
        text: body,
      })
      logger.info({ to, subject }, 'Email sent successfully')
    } catch (error) {
      logger.error({ error, to, subject }, 'Failed to send email')
      throw error
    }
  }
}
