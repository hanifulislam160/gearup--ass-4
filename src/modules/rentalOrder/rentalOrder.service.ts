import { prisma } from "../../lib/prisma";
import { ICreateRentalOrderPayload } from "./rentalOrder.interface";

// 1. Create a new rental order
const createRentalOrderInDB = async (
  customerId: string,
  payload: ICreateRentalOrderPayload,
) => {
  // 1. Fetch the gear item
  const gearItem = await prisma.gearItem.findUnique({
    where: { id: payload.gearItemId },
  });

  if (!gearItem) {
    throw new Error("Gear item not found!");
  }

  const requestedQuantity = payload.quantity || 1;
  if (gearItem.stock < requestedQuantity || !gearItem.isAvailable) {
    throw new Error(
      `Insufficient stock! Only ${gearItem.stock} items are available for rent.`,
    );
  }

  // 3. Execute database transaction safely
  const result = await prisma.$transaction(async (tx) => {
    // Create the new rental order record with quantity
    const rentalOrder = await tx.rentalOrder.create({
      data: {
        gearItemId: payload.gearItemId,
        startDate: new Date(payload.startDate),
        endDate: new Date(payload.endDate),
        totalPrice: payload.totalPrice,
        quantity: requestedQuantity,
        customerId: customerId,
      },
    });

    // dynamic stock calculation
    const newStock = gearItem.stock - requestedQuantity;

    // Update gear item stock and availability status
    await tx.gearItem.update({
      where: { id: payload.gearItemId },
      data: {
        stock: newStock,
        isAvailable: newStock > 0, // Automatically turns false if newStock hits 0
      },
    });

    return rentalOrder;
  });

  return result;
};

// 2. Get logged-in user's rental orders

const getUserRentalOrdersFromDB = async (customerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      customerId, //  Changed from 'userId' to match your schema
    },
    include: {
      gearItem: true, // Includes associated gear details
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// 3. Get specific rental order details
const getRentalOrderDetailsFromDB = async (
  rentalOrderId: string,
  customerId: string,
) => {
  const result = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
    include: {
      gearItem: true,
      customer: {
        //Changed from 'user' to 'customer' to match your schema relation
        select: { id: true, name: true, email: true }, // Returns only basic profile info for security
      },
    },
  });

  if (!result) {
    throw new Error("Rental order not found!");
  }

  // Security guard: ensure user can only view their own rental orders
  if (result.customerId !== customerId) {
    //  Changed from 'userId' to 'customerId'
    throw new Error("You are not authorized to view this rental order!");
  }

  return result;
};

export const RentalOrderServices = {
  createRentalOrderInDB,
  getUserRentalOrdersFromDB,
  getRentalOrderDetailsFromDB,
};
