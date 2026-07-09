import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import {
  ICreatePaymentIntentPayload,
  IConfirmPaymentPayload,
} from "./payment.interface";
import config from "../../config";
import { OrderStatus } from "../../../generated/prisma/enums";

// Initialize stripe
const stripe = new Stripe(config.stripe_secret_key);

const createPaymentIntentInDB = async (
  customerId: string,
  payload: ICreatePaymentIntentPayload,
) => {
  const rentalOrder = await prisma.rentalOrder.findUnique({
    where: { id: payload.rentalOrderId },
    include: { gearItem: true },
  });

  if (!rentalOrder) {
    throw new Error("Rental order not found!");
  }

  if (rentalOrder.customerId !== customerId) {
    throw new Error("You are not authorized to pay for this rental order!");
  }

  if (rentalOrder.paymentStatus === "PAID") {
    throw new Error("This rental order has already been paid for!");
  }

  // Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${config.stripe_success_url}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: config.stripe_cancel_url,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: rentalOrder.gearItem.title,
          },
          unit_amount: Math.round(
            (rentalOrder.totalPrice / rentalOrder.quantity) * 100,
          ),
        },
        quantity: rentalOrder.quantity,
      },
    ],
  });

  // Temporarily attach session.id to rentalOrder for tracking before webhook/callback confirmation
  await prisma.rentalOrder.update({
    where: { id: rentalOrder.id },
    data: { transactionId: session.id },
  });

  return {
    paymentUrl: session.url,
    sessionId: session.id,
  };
};

// Confirm/verify payment 
const confirmPaymentInDB = async (payload: IConfirmPaymentPayload) => {
  const { sessionId } = payload;

  // Retrieve session details directly from stripe to verify authenticity
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    const result = await prisma.$transaction(async (tx) => {
      const rentalOrder = await tx.rentalOrder.findUnique({
        where: { transactionId: sessionId },
      });

      if (!rentalOrder) {
        throw new Error(
          "No associated rental order found for this payment session!",
        );
      }

      // Update order status
      await tx.rentalOrder.update({
        where: { id: rentalOrder.id },
        data: {
          paymentStatus: "PAID",
          status: OrderStatus.COMPLETED,
        },
      });

      const paymentRecord = await tx.payment.create({
        data: {
          rentalOrderId: rentalOrder.id,
          amount: rentalOrder.totalPrice,
          transactionId: sessionId,
          method: "CARD", 
          provider: "STRIPE", 
          status: "PAID",
          paidAt: new Date(),
        },
      });

      return paymentRecord;
    });

    return result;
  } else {
    throw new Error("Payment was not completed successfully on Stripe!");
  }
};

// Get user's payment history
const getUserPaymentHistoryFromDB = async (customerId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId: customerId,
      },
    },
    include: {
      rentalOrder: {
        include: {
          gearItem: true
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// Get specific payment details
const getPaymentDetailsFromDB = async (
  paymentId: string,
  customerId: string,
) => {
  const result = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalOrder: {
        include: {
          customer: {
            select: { id: true, name: true, email: true },
          },
          gearItem: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("Payment records not found!");
  }

  if (result.rentalOrder.customerId !== customerId) {
    throw new Error("Unauthorized access to this payment profile");
  }

  return result;
};

export const PaymentServices = {
  createPaymentIntentInDB,
  confirmPaymentInDB,
  getUserPaymentHistoryFromDB,
  getPaymentDetailsFromDB,
};
