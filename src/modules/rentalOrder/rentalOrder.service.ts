import { prisma } from "../../lib/prisma";


// 1. Create a new rental order
const createRentalOrderInDB = async (userId: string, payload: any) => {
    // Check if the gear item exists
    const gearItem = await prisma.gearItem.findUnique({
        where: { id: payload.gearItemId },
    });

    if (!gearItem) {
        throw new Error('Gear item not found!');
    }

    // Check if the gear item is available for renting
    if (!gearItem.isAvailable) {
        throw new Error('This gear item is currently not available for rent!');
    }

    // Use transaction to create order and update gear availability safely
    const result = await prisma.$transaction(async (tx) => {
        const rentalOrder = await tx.rentalOrder.create({
            data: {
                ...payload,
                userId, // The user who is making the reservation
            },
        });

        // Update gear item availability status to false
        await tx.gearItem.update({
            where: { id: payload.gearItemId },
            data: { isAvailable: false },
        });

        return rentalOrder;
    });

    return result;
};

// 2. Get logged-in user's rental orders
const getUserRentalOrdersFromDB = async (userId: string) => {
    const result = await prisma.rentalOrder.findMany({
        where: { userId},
        include: {
            gearItem: true, // Includes associated gear details
        },
        orderBy: { createdAt: 'desc' },
    });
    return result;
};

// 3. Get specific rental order details
const getRentalOrderDetailsFromDB = async (rentalOrderId: string, userId: string) => {
    const result = await prisma.rentalOrder.findUnique({
        where: { id: rentalOrderId },
        include: {
            gearItem: true,
            user: {
                select: { id: true, name: true, email: true }, // Returns only basic user info for security
            },
        },
    });

    if (!result) {
        throw new Error('Rental order not found!');
    }

    // Security guard: ensure user can only view their own rental orders
    if (result.userId !== userId) {
        throw new Error('You are not authorized to view this rental order!');
    }

    return result;
};

export const RentalOrderServices = {
    createRentalOrderInDB,
    getUserRentalOrdersFromDB,
    getRentalOrderDetailsFromDB,
};