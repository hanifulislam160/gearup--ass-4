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
                email: { type: "string", example: "customer@gmail.com" },
                password: { type: "string", example: "123456" },
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
