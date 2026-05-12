import { Router } from 'express'
import { gradesController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

/**
 * @openapi
 * /api/v1/grades/enrollment/{enrollmentId}:
 *   get:
 *     tags: [Grades]
 *     summary: Obtener calificaciones por inscripción
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses: { 200: { description: Lista de calificaciones } }
 * /api/v1/grades:
 *   post:
 *     tags: [Grades]
 *     summary: Registrar calificación
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [enrollmentId, evaluationType, value, percentage]
 *             properties:
 *               enrollmentId: { type: string, format: uuid }
 *               evaluationType: { type: string }
 *               value: { type: number }
 *               percentage: { type: number }
 *     responses: { 201: { description: Calificación registrada } }
 * /api/v1/grades/enrollment/{enrollmentId}/calculate-final:
 *   post:
 *     tags: [Grades]
 *     summary: Calcular nota final de una inscripción
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Nota final calculada } }
 */
router.get('/enrollment/:enrollmentId', roleMiddleware('admin', 'secretary', 'directive', 'teacher'), (r, s, n) => gradesController.listByEnrollment(r, s, n))
router.post('/', roleMiddleware('teacher', 'admin'), (r, s, n) => gradesController.create(r, s, n))
router.put('/:id', roleMiddleware('teacher', 'admin'), (r, s, n) => gradesController.update(r, s, n))
router.delete('/:id', roleMiddleware('admin'), (r, s, n) => gradesController.delete(r, s, n))
router.post('/enrollment/:enrollmentId/calculate-final', roleMiddleware('teacher', 'admin'), (r, s, n) => gradesController.calculateFinal(r, s, n))

export const gradeRoutes = router
