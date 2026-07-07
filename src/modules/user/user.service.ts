import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { IRegisterUserPayload } from "./user.interface";

const registerIntoDB = async (payload: IRegisterUserPayload) => {
    const { name, email, password, role } = payload;

    // Validate required fields
    if (!name || !email || !password || !role) {
        throw new Error("Please fill out all required fields.");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("User already exists.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds) || 10
    );

    // Create user without returning password
    const result = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return result;
};

export const userServices = {
    registerIntoDB,
};