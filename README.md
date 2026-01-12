# Farmer Certification Portal - Frontend

A modern Next.js web application for the Farmer Certification Portal. This frontend provides a user-friendly interface for farmers to register, track their certification status, and for administrators to manage certification applications.

---

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

interface RegisterData {
    email: string;
    password: string;
    name: string;
    farmSize: number;
    cropType: string;
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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
