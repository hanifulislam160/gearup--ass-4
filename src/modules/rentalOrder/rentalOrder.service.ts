import { prisma } from "../../lib/prisma";
import { ICreateRentalOrderPayload } from "./rentalOrder.interface";

// Create a new rental order
const createRentalOrderInDB = async (
  customerId: string,
  payload: ICreateRentalOrderPayload,
) => {
  // Fetch the gear item
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


  const result = await prisma.$transaction(async (tx) => {
    // Create the new rental order with quantity
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

    // stock calculation
    const newStock = gearItem.stock - requestedQuantity;

    await tx.gearItem.update({
      where: { id: payload.gearItemId },
      data: {
        stock: newStock,
        isAvailable: newStock > 0,
      },
    });

    return rentalOrder;
  });

  return result;
};

//  Get logged-in user's rental orders

const getUserRentalOrdersFromDB = async (customerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      customerId, 
    },
    include: {
      gearItem: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// Get specific rental order details
const getRentalOrderDetailsFromDB = async (
  rentalOrderId: string,
  customerId: string,
) => {
  const result = await prisma.rentalOrder.findUnique({
    where: { id: rentalOrderId },
    include: {
      gearItem: true,
      customer: {
        select: { id: true, name: true, email: true }, 
      },
    },
  });

  if (!result) {
    throw new Error("Rental order not found!");
  }

  // ensure user can only view their own rental orders
  if (result.customerId !== customerId) {
  
    throw new Error("You are not authorized to view this rental order!");
  }

  return result;
};

export const RentalOrderServices = {
  createRentalOrderInDB,
  getUserRentalOrdersFromDB,
  getRentalOrderDetailsFromDB,
};
