import { Router } from 'express'
import { academicPeriodsController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

/**
 * @openapi
 * /api/v1/academic-periods:
 *   get:
 *     tags: [Academic Periods]
 *     summary: Listar períodos académicos
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Lista de períodos } }
 *   post:
 *     tags: [Academic Periods]
 *     summary: Crear período académico
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, startDate, endDate, enrollmentStart, enrollmentEnd]
 *             properties:
 *               name: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *               enrollmentStart: { type: string, format: date }
 *               enrollmentEnd: { type: string, format: date }
 *     responses: { 201: { description: Período creado } }
 */
router.get('/', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (r, s, n) => academicPeriodsController.list(r, s, n))
router.get('/:id', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (r, s, n) => academicPeriodsController.get(r, s, n))
router.post('/', roleMiddleware('admin'), (r, s, n) => academicPeriodsController.create(r, s, n))
router.put('/:id', roleMiddleware('admin'), (r, s, n) => academicPeriodsController.update(r, s, n))
router.delete('/:id', roleMiddleware('admin'), (r, s, n) => academicPeriodsController.delete(r, s, n))
export const academicPeriodRoutes = router
