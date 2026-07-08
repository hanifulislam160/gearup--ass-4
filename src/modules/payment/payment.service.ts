import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import {
  ICreatePaymentIntentPayload,
  IConfirmPaymentPayload,
} from "./payment.interface";
import config from "../../config";
import { OrderStatus } from "../../../generated/prisma/enums";

// Initialize stripe cleanly
const stripe = new Stripe(config.stripe_secret_key);

// 1. Create a payment intent/session for a rental order
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

  // Generate Stripe Checkout Session
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

// 2. Confirm/verify payment (Callback verification method)
const confirmPaymentInDB = async (payload: IConfirmPaymentPayload) => {
  const { sessionId } = payload;

  // Retrieve session details directly from stripe to verify authenticity
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    const result = await prisma.$transaction(async (tx) => {
      // Find the order referencing this transaction id session
      const rentalOrder = await tx.rentalOrder.findUnique({
        where: { transactionId: sessionId },
      });

      if (!rentalOrder) {
        throw new Error(
          "No associated rental order found for this payment session!",
        );
      }

      // Update order status fields to success
      await tx.rentalOrder.update({
        where: { id: rentalOrder.id },
        data: {
          paymentStatus: "PAID",
          status: OrderStatus.COMPLETED,
        },
      });

      //  3. New Entry: Insert permanent audited transaction record into 'Payment' table
      const paymentRecord = await tx.payment.create({
        data: {
          rentalOrderId: rentalOrder.id,
          amount: rentalOrder.totalPrice,
          transactionId: sessionId,
          method: "CARD", // Maps directly to your schema 'method' field
          provider: "STRIPE", // Ensure STRIPE is in  cluded in your PaymentProvider enum
          status: "PAID", // Maps directly to your schema 'status' field
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

// 3. Get user's payment history (Modified to query from the new Payment table)
const getUserPaymentHistoryFromDB = async (customerId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId: customerId, // Performs relational lookup filtering through rentalOrder customer fields
      },
    },
    include: {
      rentalOrder: {
        include: {
          gearItem: true, // Pulls gear profile blueprints along with invoice details
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// 4. Get specific payment details from the Payment table
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
