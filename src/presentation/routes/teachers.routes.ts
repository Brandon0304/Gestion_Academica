import { Router } from 'express'
import { teachersController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { roleMiddleware } from '../middleware/role.middleware.js'

const router = Router()
router.use(authMiddleware)

/**
 * @openapi
 * /api/v1/teachers:
 *   get:
 *     tags: [Teachers]
 *     summary: Listar docentes
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Lista de docentes } }
 *   post:
 *     tags: [Teachers]
 *     summary: Crear docente
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, documentId]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               documentId: { type: string }
 *     responses: { 201: { description: Docente creado } }
 */
router.get('/', roleMiddleware('admin', 'secretary', 'directive'), (r, s, n) => teachersController.list(r, s, n))
router.get('/:id', roleMiddleware('admin', 'secretary', 'directive'), (r, s, n) => teachersController.get(r, s, n))
router.post('/', roleMiddleware('admin', 'secretary'), (r, s, n) => teachersController.create(r, s, n))
router.put('/:id', roleMiddleware('admin', 'secretary'), (r, s, n) => teachersController.update(r, s, n))
router.delete('/:id', roleMiddleware('admin'), (r, s, n) => teachersController.delete(r, s, n))
export const teacherRoutes = router
