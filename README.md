<<<<<<< HEAD
# Farmer Certification Portal - Frontend

A modern Next.js web application for the Farmer Certification Portal. This frontend provides a user-friendly interface for farmers to register, track their certification status, and for administrators to manage certification applications.

---
=======
# Farmer Certification Portal - Backend API

A robust NestJS backend API for managing farmer certification applications. This API provides authentication, farmer registration, and certification status management.
>>>>>>> 4d26964b0be79e8be3f39ac68b1cbe18e5892af0

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Pages](#pages)
- [Components](#components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Building for Production](#building-for-production)
- [Docker](#docker)
- [License](#license)

---

## Overview

The frontend application provides:
- **Farmer Registration** - Register with farm details
- **User Authentication** - Login/logout with JWT tokens
- **Farmer Dashboard** - View profile and certification status
- **Admin Dashboard** - Manage farmer certifications
- **Responsive Design** - Works on desktop and mobile devices

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1 | React framework with App Router |
| React | 19.2 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Axios | 1.13 | HTTP client |
| js-cookie | 3.x | Cookie management |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Backend API running (see backend README)

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── register/
│   │   └── page.tsx        # Farmer registration page
│   ├── dashboard/
│   │   └── page.tsx        # Farmer dashboard
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx    # Admin dashboard
│   └── api/
│       └── config/
│           └── route.ts    # Runtime config endpoint
├── components/             # Reusable UI components
│   ├── Navbar.tsx          # Navigation bar
│   ├── ProtectedRoute.tsx  # Route guard component
│   ├── StatusBadge.tsx     # Certification status badge
│   └── index.ts            # Component exports
├── contexts/
│   └── AuthContext.tsx     # Authentication context provider
├── lib/
│   ├── api.ts              # Axios instance with interceptors
│   └── services.ts         # API service functions
├── types/
│   └── index.ts            # TypeScript interfaces
├── public/                 # Static assets
├── Dockerfile              # Docker configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

---

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# API URL for the backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For Docker deployments, the API URL can be configured at runtime via the `/api/config` endpoint.

---

## Pages

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero section and features |
| `/login` | User login form |
| `/register` | Farmer registration form |

### Protected Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard` | Farmer dashboard with profile and status | Farmers |
| `/admin/dashboard` | Admin panel for managing farmers | Admins |

---

## Components

### Navbar

The navigation bar component that displays:
- Logo and app name
- Navigation links (conditional based on auth state)
- User info and logout button (when authenticated)
- Role-based navigation (farmer vs admin)

### ProtectedRoute

A wrapper component that:
- Checks authentication status
- Redirects unauthenticated users to login
- Optionally checks for specific roles
- Shows loading state during auth check

```tsx
// Usage example
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

### StatusBadge

Displays certification status with color-coded styling:
- **Pending** - Yellow badge
- **Certified** - Green badge
- **Declined** - Red badge

```tsx
// Usage example
<StatusBadge status="certified" />
```

---

## State Management

### Authentication Context

The `AuthContext` provides global authentication state:

```tsx
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
}
```

**Features:**
- Persists user data in cookies
- Handles JWT token storage
- Automatic token refresh
- Role-based routing after login

**Usage:**
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
    const { user, isAuthenticated, login, logout } = useAuth();
    // ...
}
```

---

## API Integration

### Axios Instance

The `api.ts` module provides a configured Axios instance with:

- **Base URL Configuration** - Supports runtime configuration
- **Request Interceptor** - Automatically adds Authorization header
- **Response Interceptor** - Handles 401 errors and token refresh

### Services

The `services.ts` module provides API methods:

```typescript
// Authentication
authService.login(data: LoginData): Promise<AuthResponse>
authService.register(data: RegisterData): Promise<AuthResponse>
authService.logout(): Promise<void>

// Farmers
farmerService.getMyProfile(): Promise<User>
farmerService.getMyStatus(): Promise<FarmerStatus>
farmerService.getAllFarmers(): Promise<User[]>
farmerService.updateFarmerStatus(id: string, data: UpdateStatusData): Promise<User>
```

---

## Styling

The application uses **Tailwind CSS** for styling with:

- **Utility-first approach** - Classes applied directly to elements
- **Custom color scheme** - Green primary colors for agricultural theme
- **Responsive design** - Mobile-first with responsive breakpoints
- **Dark mode ready** - Can be extended for dark theme support

### Color Palette

| Color | Usage |
|-------|-------|
| Green (600-800) | Primary actions, headers |
| Gray (50-900) | Backgrounds, text |
| Yellow (100-600) | Pending status |
| Red (100-600) | Declined status, errors |

---

## Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

The build creates an optimized standalone output in `.next/standalone/`.

---

## Docker

### Building the Image

```bash
docker build -t farmer-cert-frontend .
```

### Running the Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://backend:8000/api \
  farmer-cert-frontend
```

### Docker Compose

The frontend is included in the root `docker-compose.yml`:

```yaml
frontend:
  build: ./frontend
  ports:
    - "3000:3000"
  environment:
    - NEXT_PUBLIC_API_URL=http://backend:8000/api
  depends_on:
    - backend
```

---

## TypeScript Interfaces

### User

```typescript
interface User {
    id: string;
    email: string;
    name: string;
    farmSize?: number;
    cropType?: string;
    role: 'farmer' | 'admin';
    status: 'pending' | 'certified' | 'declined';
    createdAt: string;
    updatedAt: string;
}
```

### Authentication

```typescript
interface LoginData {
    email: string;
    password: string;
}

<<<<<<< HEAD
interface RegisterData {
    email: string;
    password: string;
    name: string;
    farmSize: number;
    cropType: string;
=======
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Minimum 6 characters |
| `name` | string | Yes | Farmer's full name |
| `farmSize` | number | Yes | Farm size in acres (positive number) |
| `cropType` | string | Yes | Primary crop type |

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
>>>>>>> 4d26964b0be79e8be3f39ac68b1cbe18e5892af0
}

interface AuthResponse {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    user: User;
}
```

---

<<<<<<< HEAD
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
=======
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
| `email` | string | Yes | Registered email address |
| `password` | string | Yes | Account password |

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
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Minimum 6 characters |
| `name` | string | Yes | Admin's full name |

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

**Authentication:** Required (Access Token)

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

**Authentication:** Required (Refresh Token)

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

**Authentication:** Required (Admin role)

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

**Authentication:** Required (Any authenticated user)

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

**Authentication:** Required

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

**Authentication:** Required (Admin role)

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
| `status` | enum | Yes | `pending`, `certified`, `declined` |

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
>>>>>>> 4d26964b0be79e8be3f39ac68b1cbe18e5892af0
