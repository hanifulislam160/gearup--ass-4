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

  "/api/profile/update": {
    patch: {
      summary: "Update current logged-in user profile attributes",
      tags: ["User"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "John Doe Updated",
                },
                bio: {
                  type: "string",
                  example: "Experienced gear provider and tech enthusiast.",
                },
                phone: {
                  type: "string",
                  example: "+8801711223344",
                },
                city: {
                  type: "string",
                  example: "Dhaka",
                },
                address: {
                  type: "string",
                  example: "123 Main Street, Bashundhara",
                },
                photo: {
                  type: "string",
                  example:
                    "https://example.com/uploads/profile-photos/john-doe-updated.jpg",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Profile updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  statusCode: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Profile updated successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "user-uuid-123" },
                      name: { type: "string", example: "John Doe Updated" },
                      email: { type: "string", example: "user@example.com" },
                      role: { type: "string", example: "CUSTOMER" },
                      profile: {
                        type: "object",
                        properties: {
                          bio: {
                            type: "string",
                            example:
                              "Experienced gear provider and tech enthusiast.",
                          },
                          phone: { type: "string", example: "+8801711223344" },
                          city: { type: "string", example: "Dhaka" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error (Zod validation failed)",
        },
        401: {
          description: "Unauthorized - Invalid, missing, or expired token",
        },
        403: {
          description:
            "Forbidden - User does not have the required role privileges",
        },
      },
    },
  },
};
