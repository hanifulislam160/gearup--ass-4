import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { ProfileControllers } from './profile.controller';
import { Role } from '../../../generated/prisma/enums';
import { ProfileValidations } from './profile.validation';

const router = Router();

// GET: /api/profile
// Securely grabs the profile of whichever authorized user role triggers the stream
router.get(
    '/my-profile',
    auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
    ProfileControllers.getMyProfile
);

// PATCH: /api/profile
// Validates incoming properties before processing cross-table updates
router.patch(
    '/update',
    auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
    validateRequest(ProfileValidations.updateProfileValidationSchema),
    ProfileControllers.updateMyProfile
);

export const profileRoutes = router;