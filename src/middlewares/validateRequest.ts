// import { NextFunction, Request, Response } from "express";
// import { catchAsync } from "../utils/catchAsync";
// import { AnyZodObject } from "zod/v3";

// export const validateRequest = (schema: AnyZodObject) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     await schema.parseAsync({
//       body: req.body,
//       cookies: req.cookies,
//     });

//     next();
//   });
// };

import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod/v3';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      // ✅ সেফ অ্যাসাইনমেন্ট: জড স্কিমাতে ডিফাইন করা না থাকলেও এক্সপ্রেসের মূল ডাটা হারাবে না
      req.body = parsed.body || req.body;
      req.params = parsed.params || req.params; // 👈 এই লাইনটি নিশ্চিত করবে req.params যেন undefined না হয়

      // Express-এর read-only req.query হ্যান্ডেল করার লজিক
      if (parsed.query) {
        Object.keys(req.query).forEach((key) => {
          delete req.query[key];
        });
        Object.assign(req.query, parsed.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};