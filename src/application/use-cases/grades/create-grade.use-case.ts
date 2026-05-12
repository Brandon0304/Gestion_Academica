import { Grade } from '../../../domain/entities/grade.js'
import type { GradeRepository } from '../../../domain/repositories/grade-repository.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { v4 as uuid } from 'uuid'
import type { CreateGradeInput, GradeOutput } from '../../dtos/grade.js'
import type { AuditServicePort } from '../../ports/audit-service.js'
import type { NotificationServicePort } from '../../ports/notification-service.js'

export class CreateGradeUseCase {
  constructor(
    private readonly gradeRepository: GradeRepository,
    private readonly auditService?: AuditServicePort,
    private readonly notificationService?: NotificationServicePort,
  ) {}

  async execute(input: CreateGradeInput): Promise<GradeOutput> {
    const currentSum = await this.gradeRepository.sumPercentagesByEnrollment(input.enrollmentId)
    if (currentSum + input.percentage > 100.01) {
      throw new ConflictError(
        `La suma de porcentajes es ${currentSum.toFixed(2)}%. Agregar ${input.percentage}% excede el 100%`,
      )
    }

    const grade = Grade.create({
      id: uuid(),
      enrollmentId: input.enrollmentId,
      evaluationType: input.evaluationType,
      value: input.value,
      percentage: input.percentage,
      maxValue: input.maxValue ?? 20,
      observation: input.observation ?? null,
      registeredAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await this.gradeRepository.save(grade)

    await this.auditService?.record({ action: 'CREATE', entityType: 'grade', entityId: grade.id })

    return {
      id: grade.id,
      enrollmentId: grade.enrollmentId,
      evaluationType: grade.evaluationType,
      value: grade.value,
      percentage: grade.percentage,
      maxValue: grade.maxValue,
      observation: grade.observation,
      registeredAt: grade.registeredAt.toISOString(),
    }
  }
}
