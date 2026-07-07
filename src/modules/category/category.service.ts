import { prisma } from '../../lib/prisma';


const createCategoryInDB = async (payload: { name: string; description?: string }) => {
    const slug = payload.name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

    const result = await prisma.category.create({
        data: {
            name: payload.name,
            slug,
            description: payload.description,
        },
    });
    return result;
};


const getAllCategoriesFromDB = async () => {
    const result = await prisma.category.findMany({
        orderBy: { name: 'asc' },
    });
    return result;
};

export const CategoryServices = {
    createCategoryInDB,
    getAllCategoriesFromDB,
};