import { prisma } from "../../lib/prisma";

// 1. View incoming rental orders belonging to the provider's gears
const getProviderIncomingOrdersFromDB = async (providerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      gearItem: {
        // Assuming your GearItem schema connects to a provider or owner id field
        providerId: providerId,
      },
    },
    include: {
      gearItem: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

// 2. Update order status (CONFIRMED, ON_GOING, COMPLETED)
const updateProviderOrderStatusInDB = async (
  orderId: string,
  providerId: string,
  status: "CONFIRMED" | "ON_GOING" | "COMPLETED" | "CANCELLED",
) => {
  // Verify that this order actually belongs to this provider before updating
  const existingOrder = await prisma.rentalOrder.findFirst({
    where: {
      id: orderId,
      gearItem: {
        providerId: providerId,
      },
    },
  });

  if (!existingOrder) {
    throw new Error(
      "No associated or authorized rental order found under your gear profile!",
    );
  }

  // Business Logic Map:
  // confirm -> CONFIRMED
  // mark picked up -> ON_GOING
  // mark returned -> COMPLETED
  const updatedOrder = await prisma.rentalOrder.update({
    where: { id: orderId },
    data: { status },
  });

  return updatedOrder;
};

export const ProviderOrderServices = {
  getProviderIncomingOrdersFromDB,
  updateProviderOrderStatusInDB,
};
