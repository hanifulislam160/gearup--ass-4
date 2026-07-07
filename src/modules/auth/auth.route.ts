import { Router } from 'express';
import { authControllers } from './auth.controller';

const router = Router();

// POST /api/auth/login
router.post('/login', authControllers.loginUser);

// POST /api/auth/refresh-token
router.post('/refresh-token', authControllers.refreshToken);

export const authRoutes = router;