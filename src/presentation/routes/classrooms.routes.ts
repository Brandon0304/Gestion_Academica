import { Router } from 'express'
import { classroomsController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

/**
 * @openapi
 * /api/v1/classrooms:
 *   get:
 *     tags: [Classrooms]
 *     summary: Listar aulas
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Lista de aulas } }
 *   post:
 *     tags: [Classrooms]
 *     summary: Crear aula
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, capacity]
 *             properties:
 *               code: { type: string }
 *               capacity: { type: integer }
 *               type: { type: string, enum: [classroom, laboratory, workshop] }
 *     responses: { 201: { description: Aula creada } }
 */
router.get('/', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (r, s, n) => classroomsController.list(r, s, n))
router.get('/:id', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (r, s, n) => classroomsController.get(r, s, n))
router.post('/', roleMiddleware('admin'), (r, s, n) => classroomsController.create(r, s, n))
router.put('/:id', roleMiddleware('admin'), (r, s, n) => classroomsController.update(r, s, n))
router.delete('/:id', roleMiddleware('admin'), (r, s, n) => classroomsController.delete(r, s, n))
export const classroomRoutes = router
