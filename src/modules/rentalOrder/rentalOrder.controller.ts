import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { RentalOrderServices } from './rentalOrder.service';
import httpStatus from 'http-status';

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id; // Extracted from authorization middleware
    const result = await RentalOrderServices.createRentalOrderInDB(userId as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Rental order created successfully',
        data: result,
    });
});

const getUserRentalOrders = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await RentalOrderServices.getUserRentalOrdersFromDB(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User rental orders retrieved successfully',
        data: result,
    });
});

const getRentalOrderDetails = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const result = await RentalOrderServices.getRentalOrderDetailsFromDB(id as string, userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Rental order details retrieved successfully',
        data: result,
    });
});

export const RentalOrderControllers = {
    createRentalOrder,
    getUserRentalOrders,
    getRentalOrderDetails,
};