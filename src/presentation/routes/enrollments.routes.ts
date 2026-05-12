import { Router } from 'express'
import { enrollmentsController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

/**
 * @openapi
 * /api/v1/enrollments:
 *   get:
 *     tags: [Enrollments]
 *     summary: Listar inscripciones
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Lista de inscripciones } }
 *   post:
 *     tags: [Enrollments]
 *     summary: Inscribir estudiante en curso
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentId, courseId]
 *             properties:
 *               studentId: { type: string, format: uuid }
 *               courseId: { type: string, format: uuid }
 *     responses: { 201: { description: Inscripción creada } }
 * /api/v1/enrollments/{id}/status:
 *   patch:
 *     tags: [Enrollments]
 *     summary: Cambiar estado de inscripción
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses: { 200: { description: Estado actualizado } }
 */
router.get('/', roleMiddleware('admin', 'secretary', 'directive', 'student'), (r, s, n) => enrollmentsController.list(r, s, n))
router.get('/:id', roleMiddleware('admin', 'secretary', 'directive'), (r, s, n) => enrollmentsController.get(r, s, n))
router.post('/', roleMiddleware('admin', 'secretary', 'student'), (r, s, n) => enrollmentsController.create(r, s, n))
router.patch('/:id/status', roleMiddleware('admin'), (r, s, n) => enrollmentsController.changeStatus(r, s, n))
export const enrollmentRoutes = router
