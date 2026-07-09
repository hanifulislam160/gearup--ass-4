import { Router } from "express";
import { CategoryControllers } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// GET categories : Get all gear categories (Public)
router.get("/get-categories", CategoryControllers.getAllCategories);
router.get("/:id", CategoryControllers.getSingleCategory);

// POST categories: Create dynamic category (Admin Only)
router.post("/create", auth(Role.ADMIN), CategoryControllers.createCategory);
router.put("/:id", auth(Role.ADMIN), CategoryControllers.updateCategory);
router.delete("/:id", auth(Role.ADMIN), CategoryControllers.deleteCategory);

export const categoryRoutes = router;
