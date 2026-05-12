import { Router } from 'express'
import { subjectsController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

/**
 * @openapi
 * /api/v1/subjects:
 *   get:
 *     tags: [Subjects]
 *     summary: Listar asignaturas
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Lista de asignaturas } }
 *   post:
 *     tags: [Subjects]
 *     summary: Crear asignatura
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, credits]
 *             properties:
 *               code: { type: string }
 *               name: { type: string }
 *               credits: { type: integer }
 *     responses: { 201: { description: Asignatura creada } }
 */
router.get('/', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (r, s, n) => subjectsController.list(r, s, n))
router.get('/:id', roleMiddleware('admin', 'secretary', 'directive', 'teacher', 'student'), (r, s, n) => subjectsController.get(r, s, n))
router.post('/', roleMiddleware('admin'), (r, s, n) => subjectsController.create(r, s, n))
router.put('/:id', roleMiddleware('admin'), (r, s, n) => subjectsController.update(r, s, n))
router.delete('/:id', roleMiddleware('admin'), (r, s, n) => subjectsController.delete(r, s, n))
export const subjectRoutes = router
