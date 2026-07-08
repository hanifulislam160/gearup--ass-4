import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { RentalOrderValidations } from './rentalOrder.validation';
import { RentalOrderControllers } from './rentalOrder.controller';

const router = Router();

// 1. POST: Create new rental order
router.post(
    '/',
    auth(), // Requires user authentication
    validateRequest(RentalOrderValidations.createRentalOrderValidationSchema),
    RentalOrderControllers.createRentalOrder
);

// 2. GET: Get user's rental orders
router.get(
    '/',
    auth(),
    RentalOrderControllers.getUserRentalOrders
);

// 3. GET: Get rental order details by ID
router.get(
    '/:id',
    auth(),
    validateRequest(RentalOrderValidations.getRentalOrderByIdValidationSchema),
    RentalOrderControllers.getRentalOrderDetails
);

export const RentalOrderRoutes = router;