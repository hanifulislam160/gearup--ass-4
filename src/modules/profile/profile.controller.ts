import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ProfileServices } from './profile.service';
import { IProfileUpdatePayload } from './profile.interface';
import httpStatus from 'http-status';

/**
 * Handle incoming request to fetch the current logged-in user's profile documents
 */
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id; // Gathered securely from authenticating session middleware
    const result = await ProfileServices.getMyProfileFromDB(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User profile retrieved successfully',
        data: result,
    });
});

/**
 * Handle incoming request to dynamically update user parameters and related profile attributes
 */
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const updatePayload: IProfileUpdatePayload = req.body; // Strictly typing the incoming body payload

    const result = await ProfileServices.updateMyProfileInDB(userId as string, updatePayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Profile updated successfully',
        data: result,
    });
});

export const ProfileControllers = {
    getMyProfile,
    updateMyProfile,
};