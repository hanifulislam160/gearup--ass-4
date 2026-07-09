export const authDocs = {
  "/api/auth/login": {
    post: {
      summary: "Authenticate user session credentials",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "admin@rentnest.com" },
                password: { type: "string", example: "admin123" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Authentication successful" },
      },
    },
  },
};
