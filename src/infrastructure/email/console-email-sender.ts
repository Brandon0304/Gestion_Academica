import type { EmailSender } from '../../application/ports/email-sender.js'
import { logger } from '../logging/logger.js'

export class ConsoleEmailSender implements EmailSender {
  async send(to: string, subject: string, body: string): Promise<void> {
    logger.info({ to, subject }, `[EMAIL] To: ${to} | Subject: ${subject} | Body: ${body.substring(0, 200)}...`)
  }
}
