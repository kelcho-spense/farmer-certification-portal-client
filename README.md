<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# Farmer Certification Portal - Backend API

A robust NestJS backend API for managing farmer certification applications. This API provides authentication, farmer registration, and certification status management.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Health Check](#health-check)
  - [Authentication](#authentication)
  - [Farmers](#farmers)
- [Data Models](#data-models)
- [Error Handling](#error-handling)

---

## Overview

The Farmer Certification Portal backend provides:
- **JWT-based Authentication** with access and refresh tokens
- **Role-based Access Control** (Farmer & Admin roles)
- **Farmer Registration** with farm details
- **Certification Management** for admins to approve/decline applications

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | Backend framework |
| **TypeORM** | Database ORM |
| **PostgreSQL** | Database |
| **Passport JWT** | Authentication |
| **class-validator** | Request validation |
| **bcrypt** | Password hashing |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- PostgreSQL database

### Installation

```bash
# Install dependencies
pnpm install

# Run database migrations (if applicable)
pnpm run migration:run

# Seed the database
pnpm run seed

# Start development server
pnpm run start:dev
```

### Running with Docker

```bash
docker build -t farmer-cert-backend .
docker run -p 8000:8000 farmer-cert-backend
```

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server
NODE_ENV=development
PORT=8000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=farmercertdb

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_key
JWT_ACCESS_EXPIRES_IN_SECONDS=900
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN_SECONDS=604800
```

---

## API Documentation

**Base URL:** `http://localhost:8000`

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

### Health Check

#### `GET /`

Returns a welcome message.

**Authentication:** None required (Public)

**Response:**
```
Farmer Certification Portal API
```

---

#### `GET /health`

Returns the API health status.

**Authentication:** None required (Public)

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-12T10:30:00.000Z"
}
```

---

### Authentication

#### `POST /auth/register`

Register a new farmer account.

**Authentication:** None required (Public)

**Request Body:**
```json
{
  "email": "farmer@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "farmSize": 50.5,
  "cropType": "Wheat"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | Valid email address |
| `password` | string | ✅ | Minimum 6 characters |
| `name` | string | ✅ | Farmer's full name |
| `farmSize` | number | ✅ | Farm size in acres (positive number) |
| `cropType` | string | ✅ | Primary crop type |

**Success Response (201 Created):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "farmer@example.com",
    "name": "John Doe",
    "farmSize": 50.5,
    "cropType": "Wheat",
    "role": "farmer",
    "status": "pending",
    "createdAt": "2026-01-12T10:30:00.000Z",
    "updatedAt": "2026-01-12T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be at least 6 characters"],
  "error": "Bad Request"
}
```

---

#### `POST /auth/login`

Authenticate an existing user.

**Authentication:** None required (Public)

**Request Body:**
```json
{
  "email": "farmer@example.com",
  "password": "securePassword123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | Registered email address |
| `password` | string | ✅ | Account password |

**Success Response (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "farmer@example.com",
    "name": "John Doe",
    "farmSize": 50.5,
    "cropType": "Wheat",
    "role": "farmer",
    "status": "pending",
    "createdAt": "2026-01-12T10:30:00.000Z",
    "updatedAt": "2026-01-12T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

#### `POST /auth/admin/register`

Register a new admin account.

**Authentication:** None required (Public)

> **Note:** In production, this endpoint should be protected or disabled.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "secureAdminPassword",
  "name": "Admin User"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | Valid email address |
| `password` | string | ✅ | Minimum 6 characters |
| `name` | string | ✅ | Admin's full name |

**Success Response (201 Created):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "admin@example.com",
    "name": "Admin User",
    "farmSize": null,
    "cropType": null,
    "role": "admin",
    "status": "pending",
    "createdAt": "2026-01-12T10:30:00.000Z",
    "updatedAt": "2026-01-12T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### `POST /auth/logout`

Log out the current user (invalidates refresh token).

**Authentication:** 🔒 Required (Access Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### `POST /auth/refresh`

Refresh access token using a valid refresh token.

**Authentication:** 🔒 Required (Refresh Token)

**Request Headers:**
```
Authorization: Bearer <refresh_token>
```

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Access Denied",
  "error": "Unauthorized"
}
```

---

### Farmers

All farmer endpoints require authentication.

#### `GET /farmers`

Get a list of all farmers (Admin only).

**Authentication:** 🔒 Required (Admin role)

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "farmer1@example.com",
    "name": "John Doe",
    "farmSize": 50.5,
    "cropType": "Wheat",
    "role": "farmer",
    "status": "pending",
    "createdAt": "2026-01-12T10:30:00.000Z",
    "updatedAt": "2026-01-12T10:30:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "email": "farmer2@example.com",
    "name": "Jane Smith",
    "farmSize": 120.0,
    "cropType": "Corn",
    "role": "farmer",
    "status": "certified",
    "createdAt": "2026-01-11T08:00:00.000Z",
    "updatedAt": "2026-01-12T09:00:00.000Z"
  }
]
```

**Error Response (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

---

#### `GET /farmers/me`

Get the current farmer's profile.

**Authentication:** 🔒 Required (Any authenticated user)

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "farmer@example.com",
  "name": "John Doe",
  "farmSize": 50.5,
  "cropType": "Wheat",
  "role": "farmer",
  "status": "pending",
  "createdAt": "2026-01-12T10:30:00.000Z",
  "updatedAt": "2026-01-12T10:30:00.000Z"
}
```

---

#### `GET /farmers/:id/status`

Get a farmer's certification status.

**Authentication:** 🔒 Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Farmer's unique identifier |

> **Note:** Farmers can only view their own status. Admins can view any farmer's status.

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "status": "pending"
}
```

---

#### `PATCH /farmers/:id/status`

Update a farmer's certification status (Admin only).

**Authentication:** 🔒 Required (Admin role)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Farmer's unique identifier |

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "status": "certified"
}
```

| Field | Type | Required | Allowed Values |
|-------|------|----------|----------------|
| `status` | enum | ✅ | `pending`, `certified`, `declined` |

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "farmer@example.com",
  "name": "John Doe",
  "farmSize": 50.5,
  "cropType": "Wheat",
  "role": "farmer",
  "status": "certified",
  "createdAt": "2026-01-12T10:30:00.000Z",
  "updatedAt": "2026-01-12T11:00:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Farmer not found",
  "error": "Not Found"
}
```

---

## Data Models

### User Entity

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `email` | string | Unique email address |
| `name` | string | Full name |
| `farmSize` | decimal | Farm size in acres (farmers only) |
| `cropType` | string | Primary crop type (farmers only) |
| `role` | enum | `farmer` or `admin` |
| `status` | enum | `pending`, `certified`, or `declined` |
| `createdAt` | datetime | Account creation timestamp |
| `updatedAt` | datetime | Last update timestamp |

### Enums

#### UserRole
| Value | Description |
|-------|-------------|
| `farmer` | Regular farmer user |
| `admin` | Administrator with elevated privileges |

#### CertificationStatus
| Value | Description |
|-------|-------------|
| `pending` | Awaiting review |
| `certified` | Application approved |
| `declined` | Application rejected |

---

## Error Handling

The API uses standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request (validation errors) |
| `401` | Unauthorized (invalid/missing token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Resource not found |
| `409` | Conflict (e.g., email already exists) |
| `500` | Internal server error |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Error description or array of validation errors",
  "error": "Error type"
}
```

---

## Testing the API

You can test the API using the included `app.http` file with the REST Client extension in VS Code, or use tools like Postman or curl.

### Example curl commands:

```bash
# Health check
curl http://localhost:8000/health

# Register a farmer
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@test.com","password":"password123","name":"Test Farmer","farmSize":100,"cropType":"Rice"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@test.com","password":"password123"}'

# Get my profile (with token)
curl http://localhost:8000/farmers/me \
  -H "Authorization: Bearer <your_access_token>"
```

---

## License

This project is licensed under the MIT License.
>>>>>>> 527356c (Add comprehensive README documentation for the Farmer Certification Portal API)
