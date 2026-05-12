import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.grade.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.studentUser.deleteMany()
  await prisma.teacherUser.deleteMany()
  await prisma.user.deleteMany()
  await prisma.student.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.prerequisite.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.studyPlan.deleteMany()
  await prisma.academicPeriod.deleteMany()
  await prisma.classroom.deleteMany()

  const passwordHash = await bcrypt.hash('123456', 12)

  // Users
  const adminUser = await prisma.user.create({
    data: { id: uuid(), email: 'admin@academia.edu', passwordHash, role: 'admin', isActive: true },
  })
  const secretaryUser = await prisma.user.create({
    data: { id: uuid(), email: 'secretaria@academia.edu', passwordHash, role: 'secretary', isActive: true },
  })
  const directiveUser = await prisma.user.create({
    data: { id: uuid(), email: 'directivo@academia.edu', passwordHash, role: 'directive', isActive: true },
  })

  // Study Plans
  const planIngSistemas = await prisma.studyPlan.create({
    data: { id: uuid(), name: 'Ingeniería de Sistemas', code: 'IS-2024', description: 'Plan 2024 de Ingeniería de Sistemas', year: 2024, totalCredits: 200, status: 'active' },
  })
  const planAdmin = await prisma.studyPlan.create({
    data: { id: uuid(), name: 'Administración de Empresas', code: 'ADM-2024', description: 'Plan 2024 de Administración', year: 2024, totalCredits: 180, status: 'active' },
  })
  await prisma.studyPlan.create({
    data: { id: uuid(), name: 'Plan Antiguo Contabilidad', code: 'CONT-2020', description: 'Plan 2020 de Contabilidad (reemplazado)', year: 2020, totalCredits: 190, status: 'replaced' },
  })

  // Subjects
  const subMat1 = await prisma.subject.create({
    data: { id: uuid(), code: 'MAT101', name: 'Matemáticas I', description: 'Álgebra y trigonometría', credits: 4, theoryHours: 3, practiceHours: 2, studyPlanId: planIngSistemas.id },
  })
  const subMat2 = await prisma.subject.create({
    data: { id: uuid(), code: 'MAT102', name: 'Matemáticas II', description: 'Cálculo diferencial', credits: 4, theoryHours: 3, practiceHours: 2, studyPlanId: planIngSistemas.id },
  })
  const subProg1 = await prisma.subject.create({
    data: { id: uuid(), code: 'PRO101', name: 'Programación I', description: 'Fundamentos de programación', credits: 5, theoryHours: 3, practiceHours: 4, studyPlanId: planIngSistemas.id },
  })
  const subProg2 = await prisma.subject.create({
    data: { id: uuid(), code: 'PRO102', name: 'Programación II', description: 'POO y estructuras de datos', credits: 5, theoryHours: 3, practiceHours: 4, studyPlanId: planIngSistemas.id },
  })
  const subBD = await prisma.subject.create({
    data: { id: uuid(), code: 'BD101', name: 'Base de Datos', description: 'Fundamentos de BD', credits: 4, theoryHours: 2, practiceHours: 3, studyPlanId: planIngSistemas.id },
  })
  const subRedes = await prisma.subject.create({
    data: { id: uuid(), code: 'RED101', name: 'Redes de Computadoras', description: 'Fundamentos de redes', credits: 4, theoryHours: 3, practiceHours: 2, studyPlanId: planIngSistemas.id },
  })
  const subAdmin = await prisma.subject.create({
    data: { id: uuid(), code: 'ADM101', name: 'Introducción a la Administración', credits: 3, theoryHours: 3, practiceHours: 0, studyPlanId: planAdmin.id },
  })

  // Prerequisites
  await prisma.prerequisite.create({ data: { subjectId: subMat2.id, prerequisiteId: subMat1.id, type: 'required' } })
  await prisma.prerequisite.create({ data: { subjectId: subProg2.id, prerequisiteId: subProg1.id, type: 'required' } })
  await prisma.prerequisite.create({ data: { subjectId: subBD.id, prerequisiteId: subProg1.id, type: 'required' } })

  // Academic Periods
  const period2024A = await prisma.academicPeriod.create({
    data: { id: uuid(), name: 'Semestre 2024-A', startDate: new Date('2024-02-01'), endDate: new Date('2024-06-30'), enrollmentStart: new Date('2024-01-01'), enrollmentEnd: new Date('2024-02-15'), status: 'active' },
  })
  const period2024B = await prisma.academicPeriod.create({
    data: { id: uuid(), name: 'Semestre 2024-B', startDate: new Date('2024-08-01'), endDate: new Date('2024-12-20'), enrollmentStart: new Date('2024-07-01'), enrollmentEnd: new Date('2024-08-15'), status: 'planned' },
  })
  const period2023A = await prisma.academicPeriod.create({
    data: { id: uuid(), name: 'Semestre 2023-A', startDate: new Date('2023-02-01'), endDate: new Date('2023-06-30'), enrollmentStart: new Date('2023-01-01'), enrollmentEnd: new Date('2023-02-15'), status: 'closed' },
  })

  // Classrooms
  const aula101 = await prisma.classroom.create({
    data: { id: uuid(), code: 'A101', name: 'Aula 101', capacity: 40, type: 'classroom', location: 'Edificio A, Piso 1' },
  })
  const aula102 = await prisma.classroom.create({
    data: { id: uuid(), code: 'A102', name: 'Aula 102', capacity: 35, type: 'classroom', location: 'Edificio A, Piso 1' },
  })
  const labComp = await prisma.classroom.create({
    data: { id: uuid(), code: 'LAB01', name: 'Laboratorio de Cómputo', capacity: 30, type: 'laboratory', location: 'Edificio B, Piso 2' },
  })

  // Teachers
  const teacherJuan = await prisma.teacher.create({
    data: { id: uuid(), firstName: 'Juan', lastName: 'Pérez', email: 'juan.perez@academia.edu', documentId: 'DOC-001', specialty: 'Matemáticas', degree: 'Magíster', hireDate: new Date('2020-03-01'), status: 'active' },
  })
  const teacherMaria = await prisma.teacher.create({
    data: { id: uuid(), firstName: 'María', lastName: 'García', email: 'maria.garcia@academia.edu', documentId: 'DOC-002', specialty: 'Programación', degree: 'Doctora', hireDate: new Date('2019-06-15'), status: 'active' },
  })
  const teacherCarlos = await prisma.teacher.create({
    data: { id: uuid(), firstName: 'Carlos', lastName: 'López', email: 'carlos.lopez@academia.edu', documentId: 'DOC-003', specialty: 'Redes', degree: 'Magíster', hireDate: new Date('2021-01-10'), status: 'active' },
  })

  // Teacher users
  const teacherJuanUser = await prisma.user.create({
    data: { id: uuid(), email: 'juan.perez@academia.edu', passwordHash, role: 'teacher', isActive: true },
  })
  await prisma.teacherUser.create({ data: { userId: teacherJuanUser.id, teacherId: teacherJuan.id } })

  // Students
  const studentAna = await prisma.student.create({
    data: { id: uuid(), firstName: 'Ana', lastName: 'Torres', email: 'ana.torres@academia.edu', documentId: 'EST-001', birthDate: new Date('2000-05-15'), phone: '777-1234', address: 'Calle Bolívar #123', enrollmentDate: new Date('2023-02-01'), status: 'active' },
  })
  const studentLuis = await prisma.student.create({
    data: { id: uuid(), firstName: 'Luis', lastName: 'Quispe', email: 'luis.quispe@academia.edu', documentId: 'EST-002', birthDate: new Date('2001-08-20'), phone: '777-5678', enrollmentDate: new Date('2023-02-01'), status: 'active' },
  })
  const studentSofia = await prisma.student.create({
    data: { id: uuid(), firstName: 'Sofía', lastName: 'Mendoza', email: 'sofia.mendoza@academia.edu', documentId: 'EST-003', birthDate: new Date('1999-12-10'), enrollmentDate: new Date('2022-02-01'), status: 'active' },
  })

  // Student users
  const studentAnaUser = await prisma.user.create({
    data: { id: uuid(), email: 'ana.torres@academia.edu', passwordHash, role: 'student', isActive: true },
  })
  await prisma.studentUser.create({ data: { userId: studentAnaUser.id, studentId: studentAna.id } })

  // Courses
  const courseMat1 = await prisma.course.create({
    data: { id: uuid(), code: 'C-MAT101-2024A', name: 'Matemáticas I', credits: 4, maxCapacity: 40, subjectId: subMat1.id, teacherId: teacherJuan.id, academicPeriodId: period2024A.id, classroomId: aula101.id, schedule: { days: ['monday', 'wednesday'], startTime: '08:00', endTime: '09:30' }, status: 'in_progress' },
  })
  const courseProg1 = await prisma.course.create({
    data: { id: uuid(), code: 'C-PRO101-2024A', name: 'Programación I', credits: 5, maxCapacity: 30, subjectId: subProg1.id, teacherId: teacherMaria.id, academicPeriodId: period2024A.id, classroomId: labComp.id, schedule: { days: ['tuesday', 'thursday'], startTime: '10:00', endTime: '12:00' }, status: 'in_progress' },
  })
  const courseBD = await prisma.course.create({
    data: { id: uuid(), code: 'C-BD101-2024A', name: 'Base de Datos', credits: 4, maxCapacity: 35, subjectId: subBD.id, teacherId: teacherMaria.id, academicPeriodId: period2024A.id, classroomId: labComp.id, schedule: { days: ['monday', 'wednesday'], startTime: '14:00', endTime: '15:30' }, status: 'open' },
  })

  // Enrollments
  const enrollment1 = await prisma.enrollment.create({
    data: { id: uuid(), studentId: studentAna.id, courseId: courseMat1.id, enrollmentDate: new Date('2024-01-15'), status: 'enrolled' },
  })
  const enrollment2 = await prisma.enrollment.create({
    data: { id: uuid(), studentId: studentAna.id, courseId: courseProg1.id, enrollmentDate: new Date('2024-01-15'), status: 'enrolled' },
  })
  const enrollment3 = await prisma.enrollment.create({
    data: { id: uuid(), studentId: studentLuis.id, courseId: courseMat1.id, enrollmentDate: new Date('2024-01-16'), status: 'enrolled' },
  })
  const enrollment4 = await prisma.enrollment.create({
    data: { id: uuid(), studentId: studentSofia.id, courseId: courseBD.id, enrollmentDate: new Date('2024-01-20'), status: 'enrolled' },
  })

  // Grades
  await prisma.grade.create({
    data: { id: uuid(), enrollmentId: enrollment1.id, evaluationType: 'Parcial 1', value: 15, percentage: 30, maxValue: 20, observation: 'Buen desempeño', registeredAt: new Date('2024-03-15') },
  })
  await prisma.grade.create({
    data: { id: uuid(), enrollmentId: enrollment1.id, evaluationType: 'Parcial 2', value: 13, percentage: 30, maxValue: 20, registeredAt: new Date('2024-05-10') },
  })
  await prisma.grade.create({
    data: { id: uuid(), enrollmentId: enrollment2.id, evaluationType: 'Proyecto 1', value: 18, percentage: 40, maxValue: 20, registeredAt: new Date('2024-04-01') },
  })
  await prisma.grade.create({
    data: { id: uuid(), enrollmentId: enrollment2.id, evaluationType: 'Proyecto 2', value: 16, percentage: 40, maxValue: 20, registeredAt: new Date('2024-06-01') },
  })

  console.log('✅ Seed completed successfully')
  console.log('   ── Users ──')
  console.log('   admin@academia.edu / 123456 (role: admin)')
  console.log('   secretaria@academia.edu / 123456 (role: secretary)')
  console.log('   directivo@academia.edu / 123456 (role: directive)')
  console.log('   juan.perez@academia.edu / 123456 (role: teacher)')
  console.log('   ana.torres@academia.edu / 123456 (role: student)')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
