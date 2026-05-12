import type { UserRepository } from '../../../domain/repositories/user-repository.js'
import type { StudentRepository } from '../../../domain/repositories/student-repository.js'
import type { PasswordHasher } from '../../ports/password-hasher.js'
import type { TokenService } from '../../ports/token-service.js'
import { ConflictError } from '../../../shared/errors/index.js'
import { Email } from '../../../domain/value-objects/email.js'
import { DocumentId } from '../../../domain/value-objects/document-id.js'
import { User } from '../../../domain/entities/user.js'
import { Student } from '../../../domain/entities/student.js'
import { v4 as uuid } from 'uuid'
import type { RegisterStudentInput } from '../../dtos/auth.js'
import type { LoginOutput } from '../../dtos/auth.js'

export class RegisterStudentUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly studentRepository: StudentRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: RegisterStudentInput): Promise<LoginOutput> {
    const email = new Email(input.email)

    const existing = await this.userRepository.findByEmail(email)
    if (existing) {
      throw new ConflictError('El email ya está registrado')
    }

    const passwordHash = await this.passwordHasher.hash(input.password)

    const user = User.create({
      id: uuid(),
      email,
      passwordHash,
      role: 'student',
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await this.userRepository.save(user)

    const student = Student.create({
      id: uuid(),
      firstName: input.firstName,
      lastName: input.lastName,
      email,
      documentId: new DocumentId(input.dni),
      birthDate: input.birthDate ? new Date(input.birthDate) : null,
      phone: input.phone ?? null,
      address: null,
      status: 'active',
      enrollmentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await this.studentRepository.save(student)
    await this.userRepository.linkStudent(user.id, student.id)

    const token = this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email.toString(),
      role: user.role,
    })
    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id,
      email: user.email.toString(),
      role: user.role,
    })

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email.toString(),
        role: user.role,
      },
    }
  }
}
