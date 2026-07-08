import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { categoryRoutes } from "./modules/category/category.route";
import { gearRoutes } from "./modules/gear/gear.route";
import { rentalOrderRoutes } from "./modules/rentalOrder/rentalOrder.route";
import { PaymentRoutes } from "./modules/payment/payment.route";
import { providerOrderRoutes } from "./modules/providerOrder/providerOrder.route";

const app: Application = express();

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.use("/api/user", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/category", categoryRoutes);

app.use("/api/gear-items", gearRoutes);

app.use("/api/rental-order", rentalOrderRoutes);

app.use("/api/provider-order", providerOrderRoutes);

app.use("/api/payment", PaymentRoutes);

// not found route handler
app.use(notFound);

// global Error handler
app.use(globalErrorHandler);

export default app;
