import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ProviderOrderControllers } from "./providerOrder.controller";
import { ProviderOrderValidations } from "./providerOrder.validation";

const router = Router();

// 1. GET: Fetch incoming orders for provider
router.get(
  "/orders",
  auth("PROVIDER"), // Add role gating protection if your auth middleware accepts it
  ProviderOrderControllers.getProviderIncomingOrders,
);

// 2. PATCH: Update specific order state markers
router.patch(
  "/orders-status/:id",
  auth("PROVIDER"),
  validateRequest(ProviderOrderValidations.updateOrderStatusValidationSchema),
  ProviderOrderControllers.updateProviderOrderStatus,
);

export const providerOrderRoutes = router;
