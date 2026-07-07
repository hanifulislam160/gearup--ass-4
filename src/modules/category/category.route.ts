import { Router } from 'express';
import { CategoryControllers } from './category.controller';
import { auth } from '../../middlewares/auth'; // যদি অ্যাডমিন প্রটেকশন দিতে চান
import { Role } from '../../../generated/prisma/enums';

const router = Router();

// GET /api/categories -> Get all gear categories (Public)
router.get('/', CategoryControllers.getAllCategories);

// POST /api/categories -> Create dynamic category (Admin Only)
router.post('/', auth(Role.ADMIN), CategoryControllers.createCategory);

export const categoryRoutes = router;