import { Router } from 'express';
import { providerGearControllers } from './gear.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { gearValidations } from './gear.validation';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

// I need before public route

router.get(
    '/',
    validateRequest(gearValidations.getAllGearQuerySchema),
    providerGearControllers.getAllGears
);

// GET /api/gear/:id -> Get gear details
router.get(
    '/:id',
    providerGearControllers.getSingleGear
);


// provider manage


router.post(
    '/create',
    auth(Role.PROVIDER),
    validateRequest(gearValidations.createGearValidationSchema),
    providerGearControllers.createGear
);

router.patch(
    '/:id',
    auth('PROVIDER'),
    validateRequest(gearValidations.updateGearValidationSchema),
    providerGearControllers.updateGear
);

router.delete(
    '/:id',
    auth('PROVIDER'),
    providerGearControllers.deleteGear
);

router.get(
    '/orders',
    auth('PROVIDER')
    // ProviderOrderControllers.getIncomingOrders
);

// PATCH /api/provider/orders/:id -> Update rental order status
router.patch(
    '/orders/:id',
    auth('PROVIDER')
    // ProviderOrderControllers.updateOrderStatus
);

export const gearRoutes = router;