# Gear Rental & Management Platform

A robust, role-based Gear Rental and Management Platform built with **TypeScript, Node.js, Express, Prisma, and PostgreSQL**. The system supports secure multi-role registration, strict inventory controls, dynamic order placement, review validation, and integrated transactional flow tracking.

---

## 🔗 Project Links & Credentials

| Resource           | Link / Value                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **Backend Repo**   | [https://github.com/your-username/rentnest-backend](https://github.com/your-username/rentnest-backend) |
| **Live API**       | [https://rentnest-api.vercel.app](https://rentnest-api.vercel.app)                                     |
| **API Docs**       | [https://documenter.getpostman.com/view/xxx](https://documenter.getpostman.com/view/xxx)               |
| **Demo Video**     | [https://drive.google.com/file/d/xxx/view](https://drive.google.com/file/d/xxx/view)                   |
| **Admin Email**    | `admin@rentnest.com`                                                                                   |
| **Admin Password** | `admin123`                                                                                             |

---

## Key Implementations & Features

### 1. Database Architecture & Relations

Designed a highly relational and clean database schema using **Prisma ORM** adhering to the following business structures:

- **User to Profile (1-to-1):** Keeps authentication data separate from user meta-details (bio, photo, phone) using an atomic `upsert` mechanism.
- **Provider to Gear Items (1-to-Many):** Empowers landlords/technicians to list, update, and manage asset availability.
- **Customer to Rental Orders to Gear (Junction Mapping):** Tracks absolute ownership of equipment booking workflows along discrete rental timelines.
- **Rental Order to Payment (1-to-1):** Direct structural alignment ensuring unique transaction bindings to mitigate double-billing.
- **Customer to Reviews to Gear (1-to-Many):** Implements localized relational feedback.

### 2. Multi-Role Authentication & Access Control (RBAC)

- **JWT-Driven Authentication:** Secure access allocation using authorization header extraction.
- **Role Boundaries:** Isolated logic flows dividing **Customers** (renters), **Providers** (gear owners), and **Admins** (global overseers).

### 3. Core Business Logic & Validations

- **Zod Integration:** Complete runtime schema payload validation preventing unwanted field mutations before compilation.
- **Review Integrity Interceptor:** Restricts customers from posting item reviews unless a database query verifies they have a matching `COMPLETED` order status for that gear item.
- **Global Exception Handler:** Centralized express error catcher tracking type casting failures, such as `PrismaClientValidationError` errors.

---

## Tech Stack Used

- **Runtime Environment:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database Tooling:** Prisma ORM with PostgreSQL
- **Data Validation:** Zod
- **Security:** JSON Web Tokens (JWT), Bcrypt hashing
