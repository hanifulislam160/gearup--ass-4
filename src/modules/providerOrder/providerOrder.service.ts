import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

// View incoming rental orders belonging to the provider's gears
const getProviderIncomingOrdersFromDB = async (providerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      gearItem: {
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


/**
 * Update incoming rental order status with strict business rules
 */
const updateProviderOrderStatusInDB = async (
  orderId: string,
  providerId: string,
  status: OrderStatus,
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
      'No associated or authorized rental order found under your gear profile!',
    );
  }

  // 2. Payment Verification Guard: Prevent status changes (except CANCELLED) if payment is not complete
  if (status !== OrderStatus.CANCELLED && existingOrder.paymentStatus !== 'PAID') {
    throw new Error(
      'Cannot progress order status until the customer has completed the payment!',
    );
  }

  if (status === OrderStatus.CONFIRMED && existingOrder.status !== OrderStatus.PENDING) {
    throw new Error('Order is already processed beyond pending state!');
  }

  if (status === OrderStatus.ON_GOING && existingOrder.status !== OrderStatus.CONFIRMED) {
    throw new Error('Order must be CONFIRMED before marking it as ON_GOING!');
  }

  if (status === OrderStatus.COMPLETED && existingOrder.status !== OrderStatus.ON_GOING) {
    throw new Error('Order must be ON_GOING (picked up) before marking it as COMPLETED!');
  }

  // 4. Update order status in the database
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
