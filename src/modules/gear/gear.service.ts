import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { IGearItemPayload, IGearQueryFilters } from './gear.interface';


const createGearInDB = async (providerId: string, payload: IGearItemPayload) => {
    const result = await prisma.gearItem.create({
        data: {
            ...payload,
            providerId,
        },
    });
    return result;
};

const getAllGearsFromDB = async (query: IGearQueryFilters) => {
    const { searchTerm, category, brand, availability, minPrice, maxPrice, page = '1', limit = '10' } = query;

    const andConditions: Prisma.GearItemWhereInput[] = [];

    // search title, description, brand, location
    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { brand: { contains: searchTerm, mode: 'insensitive' } },
                { location: { contains: searchTerm, mode: 'insensitive' } },
            ],
        });
    }

    // cateogry filter with slug or name
    if (category) {
        andConditions.push({
            category: {
                slug: category,
            },
        });
    }

    if (brand) {
        andConditions.push({
            brand: { equals: brand, mode: 'insensitive' },
        });
    }

    if (availability) {
        andConditions.push({
            isAvailable: availability === 'true',
        });
    }

    // price range filter
    if (minPrice || maxPrice) {
        andConditions.push({
            pricePerDay: {
                gte: minPrice ? parseFloat(minPrice) : undefined,
                lte: maxPrice ? parseFloat(maxPrice) : undefined,
            },
        });
    }

    const whereConditions: Prisma.GearItemWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    // pagination
    const currentPage = Number(page);
    const currentLimit = Number(limit);
    const skip = (currentPage - 1) * currentLimit;

    const result = await prisma.gearItem.findMany({
        where: whereConditions,
        include: {
            category: true,
        },
        skip,
        take: currentLimit,
        orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.gearItem.count({ where: whereConditions });

    return {
        meta: { page: currentPage, limit: currentLimit, total },
        data: result,
    };
};

const getSingleGearFromDB = async (id: string) => {
    const result = await prisma.gearItem.findUniqueOrThrow({
        where: { id },
        include: {
            category: true,
            provider: {
                select: { id: true, name: true, email: true },
            },
            reviews: {
                include: {
                    customer: { select: { name: true } },
                },
            },
        },
    });
    return result;
};


const updateGearInDB = async (
    gearId: string,
    providerId: string,
    payload: Partial<IGearItemPayload> & { isAvailable?: boolean }
) => {
    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: { id: gearId },
    });

    if (gear.providerId !== providerId) {
        throw new Error('You are not authorized to update this gear!');
    }

    const result = await prisma.gearItem.update({
        where: { id: gearId },
        data: payload,
    });
    return result;
};

const deleteGearFromDB = async (gearId: string, providerId: string) => {
    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: { id: gearId },
    });

    if (gear.providerId !== providerId) {
        throw new Error('You are not authorized to delete this gear!');
    }

    await prisma.gearItem.delete({
        where: { id: gearId },
    });

    return null;
};

export const providerGearServices = {
    createGearInDB,
    updateGearInDB,
    deleteGearFromDB,
    getAllGearsFromDB,
    getSingleGearFromDB,
};