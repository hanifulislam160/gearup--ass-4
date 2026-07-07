import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.service";


const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  console.log(payload);

  const user = await userServices.registerIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});


export const userController = {
  registerUser
};