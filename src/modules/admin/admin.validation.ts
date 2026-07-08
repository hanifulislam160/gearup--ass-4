import { z } from 'zod/v3';

const updateUserStatusValidationSchema = z.object({
    body: z.object({
        isSuspended: z.boolean({
            required_error: 'Suspension status boolean is required',
        }),
    }),
});

export const AdminValidations = {
    updateUserStatusValidationSchema,
};