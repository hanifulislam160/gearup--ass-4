import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";
import { PaymentValidations } from "./payment.validation";
import { PaymentControllers } from "./payment.controller";
// import { PaymentControllers } from "./payment.controller";

const router = Router();

// 1. POST: Initialize stripe checkout screen links
router.post(
  "/create",
  auth(),
  validateRequest(PaymentValidations.createPaymentIntentValidationSchema),
  PaymentControllers.createPaymentIntent,
);

// 2. POST: Complete verification loop on return redirect
router.post(
  "/confirm",
  auth(),
  validateRequest(PaymentValidations.confirmPaymentValidationSchema),
  PaymentControllers.confirmPayment,
);

// 3. GET: Fetch transaction ledger for active user session
router.get("/", auth(), PaymentControllers.getUserPaymentHistory);

// 4. GET: Show standalone confirmation invoice log entry
router.get("/:id", auth(), PaymentControllers.getPaymentDetails);

export const PaymentRoutes = router;
