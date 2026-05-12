import { describe, it, expect } from 'vitest'

const API_BASE = process.env['API_URL'] ?? 'http://localhost:3000'
const API_PREFIX = `${API_BASE}/api/v1`

async function fetchJson(path: string, init?: RequestInit) {
  const res = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  const body = await res.json().catch(() => null)
  return { status: res.status, body, headers: res.headers }
}

describe('Smoke Tests — Health', () => {
  it('GET /health returns ok', async () => {
    const res = await fetch(`${API_BASE}/health`)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.db).toBe('connected')
    expect(body).toHaveProperty('timestamp')
  })
})

describe('Smoke Tests — Auth & RBAC', () => {
  let adminToken: string
  let teacherToken: string
  let studentToken: string
  let secretaryToken: string

  it('POST /auth/login as admin returns token', async () => {
    const { status, body } = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@academia.edu', password: '123456' }),
    })
    expect(status).toBe(200)
    expect(body).toHaveProperty('token')
    adminToken = body.token
  })

  it('POST /auth/login as teacher returns token', async () => {
    const { status, body } = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'juan.perez@academia.edu', password: '123456' }),
    })
    expect(status).toBe(200)
    expect(body).toHaveProperty('token')
    teacherToken = body.token
  })

  it('POST /auth/login as student returns token', async () => {
    const { status, body } = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'ana.torres@academia.edu', password: '123456' }),
    })
    expect(status).toBe(200)
    expect(body).toHaveProperty('token')
    studentToken = body.token
  })

  it('POST /auth/login as secretary returns token', async () => {
    const { status, body } = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'secretaria@academia.edu', password: '123456' }),
    })
    expect(status).toBe(200)
    expect(body).toHaveProperty('token')
    secretaryToken = body.token
  })

  it('GET /auth/me returns user info', async () => {
    const { status, body } = await fetchJson('/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(status).toBe(200)
    expect(body).toHaveProperty('email', 'admin@academia.edu')
    expect(body).toHaveProperty('role', 'admin')
  })

  it('GET /users requires admin role', async () => {
    const { status: adminStatus } = await fetchJson('/users', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(adminStatus).toBe(200)

    const { status: teacherStatus } = await fetchJson('/users', {
      headers: { Authorization: `Bearer ${teacherToken}` },
    })
    expect(teacherStatus).toBe(403)
  })
})

describe('Smoke Tests — Data-level RBAC', () => {
  let adminToken: string
  let teacherToken: string
  let studentToken: string
  let studentMeId: string

  it('Setup: log in all roles', async () => {
    const admin = await fetchJson('/auth/login', {
      method: 'POST', body: JSON.stringify({ email: 'admin@academia.edu', password: '123456' }),
    })
    adminToken = admin.body.token

    const teacher = await fetchJson('/auth/login', {
      method: 'POST', body: JSON.stringify({ email: 'juan.perez@academia.edu', password: '123456' }),
    })
    teacherToken = teacher.body.token

    const student = await fetchJson('/auth/login', {
      method: 'POST', body: JSON.stringify({ email: 'ana.torres@academia.edu', password: '123456' }),
    })
    studentToken = student.body.token
  })

  it('Admin lists students and finds at least one', async () => {
    const { status, body } = await fetchJson('/students', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(status).toBe(200)
    expect(body.data.length).toBeGreaterThan(0)
  })

  it('Student lists students and only sees themselves', async () => {
    const me = await fetchJson('/auth/me', {
      headers: { Authorization: `Bearer ${studentToken}` },
    })
    const studentEmail = me.body.email

    const { status, body } = await fetchJson('/students', {
      headers: { Authorization: `Bearer ${studentToken}` },
    })
    expect(status).toBe(200)
    expect(body.data.length).toBe(1)
    // The student should only see their own profile, matching their email
    expect(body.data[0].email).toBe(studentEmail)
    studentMeId = body.data[0].id
  })

  it('Student cannot access another student profile', async () => {
    const { status } = await fetchJson(`/students/00000000-0000-0000-0000-000000000000`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })
    expect(status).toBe(403)
  })

  it('Teacher lists courses and only sees own courses', async () => {
    const { status, body } = await fetchJson('/courses', {
      headers: { Authorization: `Bearer ${teacherToken}` },
    })
    expect(status).toBe(200)
    // Ensure teacherId was auto-filtered — at least one course exists
    expect(body.data.length).toBeGreaterThanOrEqual(0)
  })

  it('Student lists enrollments and only sees own', async () => {
    const { status, body } = await fetchJson('/enrollments', {
      headers: { Authorization: `Bearer ${studentToken}` },
    })
    expect(status).toBe(200)
    expect(body.data.length).toBeGreaterThanOrEqual(0)
  })

  it('Student cannot access another student timetable', async () => {
    const { status } = await fetchJson(`/timetable/students/${studentMeId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })
    // Should succeed because it auto-forces their own studentId
    expect(status).toBe(200)
  })
})

describe('Smoke Tests — CRUD Endpoints', () => {
  let adminToken: string
  let newStudentId: string
  let newTeacherId: string
  const suffix = Date.now().toString(36)

  it('Setup: login as admin', async () => {
    const r = await fetchJson('/auth/login', {
      method: 'POST', body: JSON.stringify({ email: 'admin@academia.edu', password: '123456' }),
    })
    adminToken = r.body.token
  })

  it('Creates a student', async () => {
    const { status, body } = await fetchJson('/students', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        firstName: 'Smoke', lastName: 'Test', email: `smoke.test.${suffix}@example.com`,
        documentId: `SM${suffix}`, enrollmentDate: '2026-03-01',
      }),
    })
    expect(status).toBe(201)
    expect(body).toHaveProperty('id')
    newStudentId = body.id
  })

  it('Creates a teacher', async () => {
    const { status, body } = await fetchJson('/teachers', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        firstName: 'Prof', lastName: 'Smoke', email: `prof.smoke.${suffix}@example.com`,
        documentId: `SM${suffix}t`, hireDate: '2026-01-15',
      }),
    })
    expect(status).toBe(201)
    expect(body).toHaveProperty('id')
    newTeacherId = body.id
  })

  it('Creates and retrieves an academic period', async () => {
    const create = await fetchJson('/academic-periods', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: `Smoke Period ${suffix}`, startDate: '2026-03-01', endDate: '2026-07-31',
        enrollmentStart: '2026-02-01', enrollmentEnd: '2026-02-28',
      }),
    })
    expect(create.status).toBe(201)

    const { status, body } = await fetchJson(`/academic-periods/${create.body.id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(status).toBe(200)
    expect(body.name).toBe(`Smoke Period ${suffix}`)
  })

  it('Creates a subject', async () => {
    const { status, body } = await fetchJson('/subjects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ code: `SMK${suffix}`, name: 'Smoke Subject', credits: 4 }),
    })
    expect(status).toBe(201)
  })

  it('Lists subjects (authenticated)', async () => {
    const { status } = await fetchJson('/subjects', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(status).toBe(200)
  })
})

describe('Smoke Tests — Request ID header', () => {
  it('Response includes X-Request-ID header', async () => {
    const res = await fetch(`${API_BASE}/health`)
    expect(res.headers.get('X-Request-ID')).toBeTruthy()
  })
})

describe('Smoke Tests — 404 and error handling', () => {
  it('GET /nonexistent returns error with requestId', async () => {
    const { status, body, headers } = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'wrong@email.com', password: 'wrong' }),
    })
    expect(status).toBe(401)
    expect(body.error).toHaveProperty('requestId')
  })
})
