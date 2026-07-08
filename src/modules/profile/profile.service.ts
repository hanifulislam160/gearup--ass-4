import { prisma } from '../../lib/prisma';
import { IProfileUpdatePayload } from './profile.interface';

/**
 * Fetch the logged-in user's profile including the connected Profile model details
 */
const getMyProfileFromDB = async (userId: string) => {
    const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profiles: true, // Pulls relational details from the Profile table
        },
        omit: {
            password: true, // Securely shields the password hash from exposure
        },
    });

    if (!userProfile) {
        throw new Error('User profile data not found!');
    }

    return userProfile;
};

/**
 * Update user account name and upsert structural data in the related Profile table
 */

const updateMyProfileInDB = async (
    userId: string,
    payload: IProfileUpdatePayload,
) => {
    const { name, ...profileData } = payload;

    const userExists = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!userExists) {
        throw new Error('User account not found!');
    }

    return await prisma.user.update({
        where: { id: userId },
        data: {
            name: name,
            profiles: {
                upsert: {
                    create: profileData,
                    update: profileData,
                },
            },
        },
        include: {
            profiles: true,
        },
        omit: {
            password: true,
        },
    });
};

export const ProfileServices = {
    getMyProfileFromDB,
    updateMyProfileInDB,
};