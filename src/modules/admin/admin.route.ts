import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AdminValidations } from './admin.validation';
import { AdminControllers } from './admin.controller';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

// Gated behind ADMIN authorization validation middleware across all route streams
router.get('/users', auth('ADMIN'), AdminControllers.getAllUsers);

router.patch(
    '/users/:id',
    auth(Role.ADMIN),
    validateRequest(AdminValidations.updateUserStatusValidationSchema),
    AdminControllers.updateUserStatus
);

router.get('/gear', auth(Role.ADMIN), AdminControllers.getAllGearListings);

router.get('/rentals', auth(Role.ADMIN), AdminControllers.getAllRentalOrders);

export const adminRoutes = router;