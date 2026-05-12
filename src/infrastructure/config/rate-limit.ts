import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: { code: 'TOO_MANY_REQUESTS', message: 'Demasiados intentos de inicio de sesión. Intente en 15 minutos.' },
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    error: { code: 'TOO_MANY_REQUESTS', message: 'Demasiados registros desde esta IP. Intente en una hora.' },
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 200,
  message: {
    error: { code: 'TOO_MANY_REQUESTS', message: 'Demasiadas solicitudes. Intente en un minuto.' },
  },
  standardHeaders: true,
  legacyHeaders: false,
})
