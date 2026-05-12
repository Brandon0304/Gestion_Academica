import { Router } from 'express'
import { authController } from '../../infrastructure/config/di.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { loginLimiter, registerLimiter } from '../../infrastructure/config/rate-limit.js'

const router = Router()

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: admin@academia.edu }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', loginLimiter, (req, res, next) => authController.login(req, res, next))

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener usuario actual
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/me', authMiddleware, (req, res, next) => authController.me(req, res, next))

router.post('/register', registerLimiter, (req, res, next) => authController.register(req, res, next))

router.post('/change-password', authMiddleware, (req, res, next) => authController.changePassword(req, res, next))

router.post('/refresh-token', (req, res, next) => authController.refreshToken(req, res, next))

export const authRoutes = router
