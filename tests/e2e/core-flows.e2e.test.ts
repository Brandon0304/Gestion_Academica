import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import type { PrismaClient } from '@prisma/client'

const API_PREFIX = '/api/v1'

describe('E2E — Autenticación y RBAC', () => {
  let app: Express
  let req: ReturnType<typeof request>
  let adminToken: string
  let studentToken: string
  let teacherToken: string

  beforeAll(async () => {
    const { createApp } = await import('../../src/infrastructure/config/app.js')
    app = createApp()
    req = request(app)

    const { prisma } = await import('../../src/infrastructure/persistence/prisma-client.js')
    try { await prisma.$connect() } catch {
      throw new Error('Base de datos no disponible para E2E tests. Asegúrate de que PostgreSQL esté corriendo.')
    }
  })

  it('POST login como admin retorna token', async () => {
    const res = await req.post(`${API_PREFIX}/auth/login`).send({ email: 'admin@academia.edu', password: '123456' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    adminToken = res.body.token
  })

  it('POST login con credenciales inválidas retorna 401', async () => {
    const res = await req.post(`${API_PREFIX}/auth/login`).send({ email: 'admin@academia.edu', password: 'wrong' })
    expect(res.status).toBe(401)
  })

  it('POST login como estudiante retorna token', async () => {
    const res = await req.post(`${API_PREFIX}/auth/login`).send({ email: 'ana.torres@academia.edu', password: '123456' })
    expect(res.status).toBe(200)
    studentToken = res.body.token
  })

  it('POST login como docente retorna token', async () => {
    const res = await req.post(`${API_PREFIX}/auth/login`).send({ email: 'juan.perez@academia.edu', password: '123456' })
    expect(res.status).toBe(200)
    teacherToken = res.body.token
  })

  it('GET /auth/me retorna datos del usuario autenticado', async () => {
    const res = await req.get(`${API_PREFIX}/auth/me`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.email).toBe('admin@academia.edu')
    expect(res.body.role).toBe('admin')
  })

  it('GET /users requiere admin — estudiante recibe 403', async () => {
    const res = await req.get(`${API_PREFIX}/users`).set('Authorization', `Bearer ${studentToken}`)
    expect(res.status).toBe(403)
  })

  it('GET /users permite acceso a admin', async () => {
    const res = await req.get(`${API_PREFIX}/users`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('Incluye header X-Request-ID en respuestas', async () => {
    const res = await req.get(`${API_PREFIX}/auth/me`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.headers['x-request-id']).toBeTruthy()
  })
})

describe('E2E — CRUD Estudiante', () => {
  let app: Express
  let req: ReturnType<typeof request>
  let adminToken: string
  let createdStudentId: string
  const testEmail = `e2e-student-${Date.now()}@test.com`

  beforeAll(async () => {
    const { createApp } = await import('../../src/infrastructure/config/app.js')
    app = createApp()
    req = request(app)

    const loginRes = await req.post(`${API_PREFIX}/auth/login`).send({ email: 'admin@academia.edu', password: '123456' })
    adminToken = loginRes.body.token
  })

  afterAll(async () => {
    if (createdStudentId) {
      const { prisma } = await import('../../src/infrastructure/persistence/prisma-client.js')
      await prisma.student.delete({ where: { id: createdStudentId } }).catch(() => {})
      await prisma.studentUser.deleteMany({ where: { studentId: createdStudentId } }).catch(() => {})
      await prisma.$disconnect()
    }
  })

  it('POST /students — crear estudiante', async () => {
    const res = await req.post(`${API_PREFIX}/students`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'E2E',
        lastName: 'TestStudent',
        email: testEmail,
        documentId: `E2E-${Date.now()}`,
        enrollmentDate: '2026-03-01',
      })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    createdStudentId = res.body.id
  })

  it('GET /students/:id — obtener estudiante creado', async () => {
    const res = await req.get(`${API_PREFIX}/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.email).toBe(testEmail)
  })

  it('GET /students — listar estudiantes (paginado)', async () => {
    const res = await req.get(`${API_PREFIX}/students`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
  })

  it('PUT /students/:id — actualizar estudiante', async () => {
    const res = await req.put(`${API_PREFIX}/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ firstName: 'E2E-Updated', phone: '777-9999' })
    expect(res.status).toBe(200)
    expect(res.body.firstName).toBe('E2E-Updated')
    expect(res.body.phone).toBe('777-9999')
  })

  it('DELETE /students/:id — eliminar estudiante', async () => {
    const res = await req.delete(`${API_PREFIX}/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(204)
    createdStudentId = ''
  })
})

describe('E2E — Curso, Inscripción y Calificaciones', () => {
  let app: Express
  let req: ReturnType<typeof request>
  let adminToken: string
  let student: { id: string; email: string }
  let subjectId: string
  let teacherId: string
  let academicPeriodId: string
  let classroomId: string
  let courseId: string
  let enrollmentId: string
  let gradeId: string

  const testStudentEmail = `e2e-enroll-${Date.now()}@test.com`

  beforeAll(async () => {
    const { createApp } = await import('../../src/infrastructure/config/app.js')
    app = createApp()
    req = request(app)
    const { prisma } = await import('../../src/infrastructure/persistence/prisma-client.js')

    const loginRes = await req.post(`${API_PREFIX}/auth/login`).send({ email: 'admin@academia.edu', password: '123456' })
    adminToken = loginRes.body.token

    // Obtener IDs del seed data
    const subjectsRes = await req.get(`${API_PREFIX}/subjects`).set('Authorization', `Bearer ${adminToken}`)
    subjectId = subjectsRes.body.data[0].id

    const teachersRes = await req.get(`${API_PREFIX}/teachers`).set('Authorization', `Bearer ${adminToken}`)
    teacherId = teachersRes.body.data[0].id

    const periodRes = await req.post(`${API_PREFIX}/academic-periods`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `E2E Period ${Date.now()}`,
        startDate: '2026-01-01', endDate: '2026-12-31',
        enrollmentStart: '2026-01-01', enrollmentEnd: '2026-12-31',
      })
    academicPeriodId = periodRes.body.id

    const classroomsRes = await req.get(`${API_PREFIX}/classrooms`).set('Authorization', `Bearer ${adminToken}`)
    classroomId = classroomsRes.body.data[0].id

    // Crear estudiante para inscripción
    const studentRes = await req.post(`${API_PREFIX}/students`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'E2E',
        lastName: 'EnrollStudent',
        email: testStudentEmail,
        documentId: `E2E-D${Date.now()}`,
        enrollmentDate: '2026-03-01',
      })
    student = studentRes.body
  })

  afterAll(async () => {
    const { prisma } = await import('../../src/infrastructure/persistence/prisma-client.js')
    if (student?.id) {
      await prisma.grade.deleteMany({ where: { enrollment: { studentId: student.id } } }).catch(() => {})
      await prisma.enrollment.deleteMany({ where: { studentId: student.id } }).catch(() => {})
      await prisma.studentUser.deleteMany({ where: { studentId: student.id } }).catch(() => {})
      await prisma.student.delete({ where: { id: student.id } }).catch(() => {})
    }
    if (courseId) {
      await prisma.course.delete({ where: { id: courseId } }).catch(() => {})
    }
    if (academicPeriodId) {
      await prisma.academicPeriod.delete({ where: { id: academicPeriodId } }).catch(() => {})
    }
    await prisma.$disconnect()
  })

  it('POST /courses — crear curso', async () => {
    const res = await req.post(`${API_PREFIX}/courses`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: `C${Date.now()}`,
        name: 'Curso E2E Test',
        credits: 4,
        maxCapacity: 30,
        subjectId,
        teacherId,
        academicPeriodId,
        classroomId,
        schedule: { days: ['monday', 'wednesday'], startTime: '08:00', endTime: '09:30' },
      })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    courseId = res.body.id
  })

  it('GET /courses/:id — obtener curso creado', async () => {
    const res = await req.get(`${API_PREFIX}/courses/${courseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Curso E2E Test')
  })

  it('POST /enrollments — inscribir estudiante en el curso', async () => {
    const res = await req.post(`${API_PREFIX}/enrollments`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ studentId: student.id, courseId })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    enrollmentId = res.body.id
  })

  it('POST /enrollments — rechazar inscripción duplicada', async () => {
    const res = await req.post(`${API_PREFIX}/enrollments`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ studentId: student.id, courseId })
    expect(res.status).toBe(409)
  })

  it('GET /enrollments — listar inscripciones', async () => {
    const res = await req.get(`${API_PREFIX}/enrollments`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /courses — listar cursos con filtro de período', async () => {
    const res = await req.get(`${API_PREFIX}/courses?academicPeriodId=${academicPeriodId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
  })

  it('POST /grades — registrar calificación', async () => {
    const res = await req.post(`${API_PREFIX}/grades`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        enrollmentId,
        evaluationType: 'Examen Parcial',
        value: 15,
        percentage: 50,
        maxValue: 20,
      })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    gradeId = res.body.id
  })

  it('POST /grades — registrar segunda calificación', async () => {
    const res = await req.post(`${API_PREFIX}/grades`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        enrollmentId,
        evaluationType: 'Examen Final',
        value: 18,
        percentage: 50,
        maxValue: 20,
      })
    expect(res.status).toBe(201)
  })

  it('GET /grades/enrollment/:id — obtener calificaciones de la inscripción', async () => {
    const res = await req.get(`${API_PREFIX}/grades/enrollment/${enrollmentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(2)
  })

  it('PUT /grades/:id — actualizar calificación', async () => {
    const res = await req.put(`${API_PREFIX}/grades/${gradeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ value: 17, observation: 'Corregido' })
    expect(res.status).toBe(200)
    expect(res.body.value).toBe(17)
  })

  it('POST /grades/enrollment/:id/calculate-final — calcular nota final', async () => {
    const res = await req.post(`${API_PREFIX}/grades/enrollment/${enrollmentId}/calculate-final`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('finalGrade')
    expect(typeof res.body.finalGrade).toBe('number')
  })
})

describe('E2E — Reportes', () => {
  let app: Express
  let req: ReturnType<typeof request>
  let adminToken: string
  let seedStudentId: string
  let seedCourseId: string
  let seedEnrollmentId: string

  beforeAll(async () => {
    const { createApp } = await import('../../src/infrastructure/config/app.js')
    app = createApp()
    req = request(app)

    const loginRes = await req.post(`${API_PREFIX}/auth/login`).send({ email: 'admin@academia.edu', password: '123456' })
    adminToken = loginRes.body.token

    // Obtener IDs del seed data para reportes
    const studentsRes = await req.get(`${API_PREFIX}/students`).set('Authorization', `Bearer ${adminToken}`)
    seedStudentId = studentsRes.body.data[0].id

    const coursesRes = await req.get(`${API_PREFIX}/courses`).set('Authorization', `Bearer ${adminToken}`)
    seedCourseId = coursesRes.body.data[0].id

    const enrollmentsRes = await req.get(`${API_PREFIX}/enrollments`).set('Authorization', `Bearer ${adminToken}`)
    seedEnrollmentId = enrollmentsRes.body.data[0]?.id
  })

  it('GET /reports/students/:id/history — historial académico del estudiante', async () => {
    const res = await req.get(`${API_PREFIX}/reports/students/${seedStudentId}/history`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('studentId')
    expect(res.body).toHaveProperty('studentName')
    expect(res.body).toHaveProperty('enrollments')
    expect(Array.isArray(res.body.enrollments)).toBe(true)
  })

  it('GET /reports/courses/:id/grades — reporte de calificaciones del curso', async () => {
    const res = await req.get(`${API_PREFIX}/reports/courses/${seedCourseId}/grades`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('courseId')
    expect(res.body).toHaveProperty('courseName')
    expect(res.body).toHaveProperty('students')
    expect(Array.isArray(res.body.students)).toBe(true)
  })

  it('GET /reports/courses/:id/grades — error si el curso no existe', async () => {
    const res = await req.get(`${API_PREFIX}/reports/courses/00000000-0000-0000-0000-000000000000/grades`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(404)
  })
})

describe('E2E — Planes de Estudio', () => {
  let app: Express
  let req: ReturnType<typeof request>
  let adminToken: string
  let planId: string

  beforeAll(async () => {
    const { createApp } = await import('../../src/infrastructure/config/app.js')
    app = createApp()
    req = request(app)

    const loginRes = await req.post(`${API_PREFIX}/auth/login`).send({ email: 'admin@academia.edu', password: '123456' })
    adminToken = loginRes.body.token
  })

  afterAll(async () => {
    if (planId) {
      const { prisma } = await import('../../src/infrastructure/persistence/prisma-client.js')
      await prisma.prerequisite.deleteMany({ where: { studyPlanId: planId } }).catch(() => {})
      await prisma.subject.deleteMany({ where: { studyPlanId: planId } }).catch(() => {})
      await prisma.studyPlan.delete({ where: { id: planId } }).catch(() => {})
      await prisma.$disconnect()
    }
  })

  it('POST /study-plans — crear plan de estudio', async () => {
    const res = await req.post(`${API_PREFIX}/study-plans`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Plan E2E Test',
        code: `P${Date.now()}`,
        description: 'Plan creado en E2E test',
        year: 2026,
        totalCredits: 150,
        status: 'active',
      })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    planId = res.body.id
  })

  it('GET /study-plans — listar planes de estudio', async () => {
    const res = await req.get(`${API_PREFIX}/study-plans`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /study-plans/:id — obtener plan de estudio', async () => {
    const res = await req.get(`${API_PREFIX}/study-plans/${planId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Plan E2E Test')
  })

  it('PUT /study-plans/:id — actualizar plan', async () => {
    const res = await req.put(`${API_PREFIX}/study-plans/${planId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Plan E2E Updated', totalCredits: 160 })
    expect(res.status).toBe(200)
  })

  it('DELETE /study-plans/:id — eliminar plan', async () => {
    const res = await req.delete(`${API_PREFIX}/study-plans/${planId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(204)
    planId = ''
  })
})
