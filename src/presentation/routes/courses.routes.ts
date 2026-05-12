import { Router } from 'express'
import { coursesController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

/**
 * @openapi
 * /api/v1/courses:
 *   get:
 *     tags: [Courses]
 *     summary: Listar cursos
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Lista de cursos } }
 *   post:
 *     tags: [Courses]
 *     summary: Crear curso
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, credits, maxCapacity, subjectId, teacherId, academicPeriodId]
 *             properties:
 *               code: { type: string }
 *               name: { type: string }
 *               credits: { type: integer }
 *               maxCapacity: { type: integer }
 *               subjectId: { type: string, format: uuid }
 *               teacherId: { type: string, format: uuid }
 *               academicPeriodId: { type: string, format: uuid }
 *     responses: { 201: { description: Curso creado } }
 * /api/v1/courses/{id}/status:
 *   patch:
 *     tags: [Courses]
 *     summary: Cambiar estado del curso
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [open, closed, in_progress, finished] }
 *     responses: { 200: { description: Estado actualizado } }
 */
router.get('/', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (r, s, n) => coursesController.list(r, s, n))
router.get('/:id', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (r, s, n) => coursesController.get(r, s, n))
router.post('/', roleMiddleware('admin', 'secretary'), (r, s, n) => coursesController.create(r, s, n))
router.put('/:id', roleMiddleware('admin', 'secretary'), (r, s, n) => coursesController.update(r, s, n))
router.delete('/:id', roleMiddleware('admin'), (r, s, n) => coursesController.delete(r, s, n))
router.patch('/:id/status', roleMiddleware('admin', 'secretary'), (r, s, n) => coursesController.changeStatus(r, s, n))
export const courseRoutes = router
