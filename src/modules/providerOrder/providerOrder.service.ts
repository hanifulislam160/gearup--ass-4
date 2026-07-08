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

  
  if (status === "CONFIRMED" && existingOrder.paymentStatus !== "PAID") {
    throw new Error(
      "Cannot confirm order until the customer has completed the payment!",
    );
  }

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
