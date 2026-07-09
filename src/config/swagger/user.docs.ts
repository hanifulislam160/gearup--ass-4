export const userDocs = {
  "/api/user/register": {
    post: {
      summary: "Register a new user",
      tags: ["User"],
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "securePassword123" },
                role: {
                  type: "string",
                  enum: ["CUSTOMER", "PROVIDER"],
                  default: "CUSTOMER",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "User registered successfully" },
      },
    },
  },
  "/api/user/me": {
    get: {
      summary: "Get current logged-in user details with profile",
      tags: ["User"],
      responses: {
        200: { description: "Successfully retrieved profile" },
      },
    },
  },
};
