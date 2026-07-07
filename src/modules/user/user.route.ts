import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { auth } from "../../middlewares/auth";

const router = Router();

// router.post('/register', userController.registerUser);
router.post(
  "/register",
  validateRequest(UserValidations.registerUserValidationSchema),
  userController.registerUser,
);
router.get("/me", auth(), userController.getUserMe);

export const userRoutes = router;
