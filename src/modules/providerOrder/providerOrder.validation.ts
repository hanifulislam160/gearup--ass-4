import { z } from "zod/v3";

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["CONFIRMED", "ON_GOING", "COMPLETED", "CANCELLED"], {
      required_error: "Valid order status is required to update metrics",
    }),
  }),
});

export const ProviderOrderValidations = {
  updateOrderStatusValidationSchema,
};
