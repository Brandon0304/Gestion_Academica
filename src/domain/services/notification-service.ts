import type { EmailSender } from '../../application/ports/email-sender.js'

export class NotificationService {
  constructor(private readonly emailSender: EmailSender) {}

  async notifyEnrollment(studentEmail: string, studentName: string, courseName: string): Promise<void> {
    const subject = 'Inscripción Confirmada - G_Académica'
    const body = `Hola ${studentName},\n\nTe has inscrito exitosamente en el curso: ${courseName}.\n\nSaludos,\nG_Académica`
    await this.emailSender.send(studentEmail, subject, body)
  }

  async notifyGrade(studentEmail: string, studentName: string, courseName: string, grade: number, evaluationType: string): Promise<void> {
    const subject = 'Nueva Calificación - G_Académica'
    const body = `Hola ${studentName},\n\nSe ha registrado una nueva calificación para el curso ${courseName}:\n- Tipo: ${evaluationType}\n- Nota: ${grade}\n\nSaludos,\nG_Académica`
    await this.emailSender.send(studentEmail, subject, body)
  }
}
