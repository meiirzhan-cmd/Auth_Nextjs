# Auth_Nextjs

A modern authentication and authorization system built with Next.js 16, Prisma 7, and Zod validation.

## 📋 Overview

This project implements a secure authentication system with JWT-based session management, password hashing, and form validation. It demonstrates best practices for building authentication flows in Next.js using the App Router architecture.

**Security Architecture:**
- **Proxy Pattern** - Optimistic auth checks with middleware (no database queries)
- **Data Access Layer (DAL)** - Centralized secure auth verification
- **Data Transfer Objects (DTOs)** - Permission-based data exposure
- **Server Actions** - Mutation protection with auth verification

## ✨ Features

- **User Authentication**
  - Secure signup and login functionality
  - Password hashing using bcrypt
  - JWT-based session management with jose
  - HTTP-only secure cookies for session storage

- **Form Validation**
  - Client and server-side validation using Zod
  - Real-time error feedback
  - Type-safe form handling

- **Database Management**
  - Prisma ORM with SQLite database
  - Type-safe database queries
  - Automatic migrations

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Custom components for auth flows
  - Loading states and error handling
  - Route groups for organized page structure

- **Security Architecture**
  - Proxy pattern for optimistic checks (middleware)
  - Data Access Layer (DAL) for secure operations
  - Data Transfer Objects (DTOs) for safe data exposure
  - React cache for performance optimization
  - Defense-in-depth approach

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.1](https://nextjs.org/) - React framework with App Router
- **Database ORM**: [Prisma 7.2.0](https://www.prisma.io/) - Next-generation ORM
- **Database**: SQLite with better-sqlite3 adapter
- **Validation**: [Zod 4.1.12](https://zod.dev/) - TypeScript-first schema validation
- **Authentication**: JWT with jose library
- **Password Security**: bcrypt for password hashing
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v20 or higher recommended)
- npm, yarn, or pnpm package manager
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Auth_Nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Session secret key (generate a secure random string)
   SESSION_SECRET=your-super-secret-session-key-here

   # Database URL (SQLite local file)
   DATABASE_URL="file:./dev.db"
   ```

   > **Note**: Generate a strong SESSION_SECRET using:
   > ```bash
   > openssl rand -base64 32
   > ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev --name init
   ```

## 🗄️ Database Schema

The application uses a simple User model:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 💻 Running the Application

### Development Mode

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
Auth_Nextjs/
├── app/
│   ├── (auth)/              # Authentication route group
│   │   ├── login/
│   │   │   ├── action.ts    # Login server action
│   │   │   └── page.tsx     # Login page
│   │   ├── signup/
│   │   │   ├── action.ts    # Signup server action
│   │   │   └── page.tsx     # Signup page
│   │   └── layout.tsx       # Auth layout wrapper
│   ├── (dashboard)/         # Protected dashboard route group
│   │   └── home/
│   │       ├── action.ts    # Dashboard actions
│   │       └── page.tsx     # Home page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── auth/                # Authentication components
│   ├── examples/            # Example protected components with DAL
│   ├── status/              # Status and error components
│   ├── svg/                 # SVG icon components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── dal.ts               # Data Access Layer (auth verification)
│   ├── dto.ts               # Data Transfer Objects (safe data exposure)
│   ├── definitions.ts       # TypeScript type definitions
│   ├── prisma.ts            # Prisma client configuration
│   ├── session.ts           # Session management utilities
│   ├── actions-example.ts   # Example Server Actions with auth
│   ├── login/               # Login-specific utilities
│   └── signup/              # Signup-specific utilities
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── generated/           # Generated Prisma Client
├── .env                     # Environment variables (create this)
├── middleware.ts            # Route protection middleware
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## 🔐 Authentication Flow

### Signup Process

1. User submits signup form (email, name, password)
2. Zod validates input on server
3. Password is hashed using bcrypt
4. User record is created in database
5. JWT session token is generated
6. Session cookie is set (httpOnly, secure, sameSite)
7. User is redirected to dashboard

### Login Process

1. User submits login credentials
2. Server validates input with Zod
3. Email lookup in database
4. Password verification using bcrypt
5. JWT session token is generated
6. Session cookie is set
7. User is redirected to dashboard

### Session Management

- Sessions are stored as JWT tokens in HTTP-only cookies
- Session expiration: 7 days
- Session payload includes: userId, email, name, expiresAt
- Tokens are encrypted using HS256 algorithm
- Sessions can be verified and decrypted server-side

### Proxy Pattern (Optimistic Checks with Middleware)

The application uses Next.js middleware as a **Proxy** (`middleware.ts`) for optimistic authentication checks:

**Route Configuration:**
- **Public Routes** (`/`): Accessible to everyone
- **Auth Routes** (`/login`, `/signup`): Redirect authenticated users to `/home`
- **Protected Routes** (`/home`): Redirect unauthenticated users to `/login`

**How the Proxy Works:**

```typescript
// middleware.ts - Runs on EVERY route (including prefetched)
export default async function middleware(req: NextRequest) {
  // 1. Decrypt session from cookie (optimistic check)
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // 2. Redirect to /login if not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 3. Redirect to /home if authenticated
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  return NextResponse.next();
}
```

**Key Characteristics:**
- ✅ Performs **optimistic checks** (reads session from cookie only)
- ✅ **No database queries** - fast performance on every route
- ✅ Runs on prefetched routes - good for UX
- ✅ Centralizes redirect logic
- ✅ Pre-filters unauthorized users
- ⚠️ **NOT for security alone** - always verify in DAL/Server Actions

**When to Use Proxy:**
- Perform initial route access checks
- Centralize redirect logic
- Protect static routes that share data between users
- Improve UX by early redirects

**Important:** Since the proxy runs on every route, it only reads from the cookie to avoid performance issues. For secure operations, always use the Data Access Layer (DAL) to verify against the database.

### Authentication Context

The app provides a React Context for accessing user authentication state:

```tsx
"use client";
import { useAuth } from "@/components/auth/AuthChecker";

export default function MyComponent() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>;
  }

  return <div>Please log in</div>;
}
```

The `AuthProvider` wraps the entire app in `app/layout.tsx` and:
- Verifies session on server-side
- Provides user data to all client components
- Updates automatically when session changes

### Data Access Layer (DAL)

The application uses a centralized Data Access Layer (`lib/dal.ts`) for all auth checks and data access:

**Key Functions:**

- `verifySession()` - Primary auth check with automatic redirect
- `getUser()` - Fetch user data with built-in auth verification
- `verifySessionOptimistic()` - Optimistic check without redirect (for middleware)

**Usage in Server Components:**

```tsx
import { verifySession, getUser } from "@/lib/dal";

export default async function ProtectedPage() {
  // Verify auth and get session data
  const session = await verifySession();

  // Fetch user from database
  const user = await getUser();

  return <div>Welcome, {user.name}!</div>;
}
```

**Usage in Server Actions:**

```tsx
"use server";
import { verifySession } from "@/lib/dal";

export async function updateProfile(formData: FormData) {
  // Always verify session in Server Actions
  const session = await verifySession();

  // Proceed with authorized operation
  await prisma.user.update({
    where: { id: session.userId },
    data: { /* ... */ }
  });
}
```

**Benefits:**
- Centralized auth logic
- React cache memoization prevents duplicate checks
- Consistent security across the app
- Easier to audit and maintain

### Data Transfer Objects (DTO)

DTOs (`lib/dto.ts`) control what data is exposed to clients:

```tsx
import { getProfileDTO } from "@/lib/dto";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  // Returns only fields the current user can see
  const profile = await getProfileDTO(params.id);

  return (
    <div>
      <h1>{profile.name}</h1>
      {/* Email only shown if viewing own profile */}
      {profile.email && <p>Email: {profile.email}</p>}
    </div>
  );
}
```

**DTO Functions:**
- `getProfileDTO(userId)` - Permission-based field visibility
- `getPublicProfileDTO(userId)` - Minimal public data
- `getOwnProfileDTO()` - Full access to own data

## 🔒 Security Features

### Authentication & Sessions
- **Password Hashing**: bcrypt with salting for secure password storage
- **HTTP-Only Cookies**: Prevents XSS attacks on session tokens
- **Secure Cookies**: HTTPS-only in production
- **SameSite Policy**: CSRF protection
- **JWT Encryption**: Signed tokens with HS256 algorithm
- **7-Day Expiration**: Automatic session timeout

### Authorization & Access Control
- **Proxy Pattern (Middleware)**: Optimistic route-level checks (cookie-only, no database)
- **Data Access Layer**: Centralized auth verification for all data operations
- **React Cache Memoization**: Prevents duplicate auth checks in single render
- **Server-Only Code**: Sensitive operations marked with "server-only" directive
- **Automatic Redirects**: Seamless redirect to login for unauthenticated users

### Data Security
- **Data Transfer Objects**: Permission-based field visibility
- **Explicit Column Selection**: Never return whole objects with passwords
- **Role-Based Access**: Ready for role/permission expansion
- **Server Actions Auth**: Every mutation verified server-side

### Defense in Depth
1. **Proxy (Middleware)** - Fast optimistic checks (cookie only)
2. **DAL** - Secure checks at data layer (verifies + fetches)
3. **Server Actions** - Auth verification before mutations
4. **DTOs** - Field-level permission checks

### Security Best Practices
- ✅ Auth checks as close to data source as possible
- ✅ Never trust client-side checks alone
- ✅ All Server Actions verify session
- ✅ Proxy only for UX optimization (not security)
- ✅ Database queries only in DAL/DTOs
- ✅ Sensitive data never exposed to client

## 🏗️ Security Architecture

This application implements a multi-layered security approach following Next.js best practices:

### Layer 1: Proxy (Optimistic Checks with Middleware)

```typescript
// middleware.ts - Fast, cookie-only checks (proxy pattern)
- Runs on EVERY route (including prefetched)
- Only reads session from cookie (no database)
- Redirects based on authentication state
- Good for UX, NOT for security alone
- Centralizes redirect logic and pre-filters unauthorized users
```

**Why use a Proxy?**
- Perform optimistic checks for better UX
- Protect static routes that share data between users
- Centralize redirect logic in one place
- Pre-filter unauthorized users before components render

**Important:** Since the proxy runs on every route (including prefetched), it only reads from cookies to avoid performance issues. Never use it as your only security layer.

### Layer 2: Data Access Layer (Secure Checks)

```typescript
// lib/dal.ts - Centralized auth verification
- verifySession() in EVERY protected operation
- Uses React cache to prevent duplicate checks
- Redirects unauthenticated users
- Single source of truth for auth
```

### Layer 3: Server Actions (Mutation Protection)

```typescript
// Server Actions - Auth before ANY mutation
- ALWAYS call verifySession() first
- Verify permissions before operations
- Return early if unauthorized
- Revalidate affected paths
```

### Layer 4: Data Transfer Objects (Field-Level Security)

```typescript
// lib/dto.ts - Permission-based data exposure
- Only return fields user can see
- Explicit column selection (never SELECT *)
- Hide sensitive data (passwords, etc.)
- Conditional field visibility
```

### Example: Complete Security Flow

```tsx
// 1. Proxy (Middleware) catches route access - OPTIMISTIC CHECK
export default async function middleware(req: NextRequest) {
  const session = await decrypt(req.cookies.get("session")?.value);
  if (!session && isProtectedRoute) {
    return NextResponse.redirect("/login");
  }
  // No database query here - fast performance
}

// 2. Server Component verifies via DAL - SECURE CHECK
export default async function Page() {
  const session = await verifySession(); // Redirects if invalid
  const user = await getUser(); // Fetches with auth check
  return <UserProfile user={user} />;
}

// 3. Server Action verifies before mutation
export async function updateProfile(data: FormData) {
  const session = await verifySession(); // Required!
  await prisma.user.update({ where: { id: session.userId }, data });
}

// 4. DTO controls what data is exposed
export async function getProfileDTO(userId: string) {
  const viewer = await getUser();
  const profile = await prisma.user.findUnique({ where: { id: userId } });
  return {
    name: profile.name,
    email: viewer.id === userId ? profile.email : null, // Conditional
  };
}
```

### Key Security Principles

1. **Never trust the client** - Always verify server-side
2. **Check close to data** - Auth checks in DAL, not in layouts
3. **Proxy is optimistic** - For UX only, not security
4. **Cache strategically** - React cache prevents duplicate checks
5. **Explicit > Implicit** - SELECT specific columns, not *
6. **Fail securely** - Redirect/return null on auth failure
7. **No DB in proxy** - Middleware should only read cookies for performance

### Common Pitfalls to Avoid

❌ **Don't do this:**
```tsx
// Checking auth only in proxy (middleware)
export default async function middleware(req) {
  if (!session) redirect("/login");
}

// Then assuming auth in Server Component - DANGEROUS!
export default async function Page() {
  const user = await prisma.user.findMany(); // No auth check!
}
```

**Why this is wrong:** The proxy only does optimistic checks. An attacker could bypass it or the cookie could be invalid.

✅ **Do this instead:**
```tsx
// Proxy for UX (optional but recommended)
export default async function middleware(req) {
  const session = await decrypt(req.cookies.get("session")?.value);
  if (!session) redirect("/login");
}

// ALSO verify in component (REQUIRED for security)
export default async function Page() {
  await verifySession(); // Required - redirects if invalid
  const user = await getUser(); // With auth check + database verification
}
```

**Why this is correct:** Defense in depth - proxy improves UX, DAL provides security.

## 🎨 Styling

The project uses Tailwind CSS 4 with PostCSS for styling. Component-based approach with reusable UI components.

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🔧 Prisma Commands

| Command | Description |
|---------|-------------|
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev` | Create and apply migrations |
| `npx prisma db push` | Push schema changes without migrations |

## 🚧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SESSION_SECRET` | Secret key for JWT signing | Yes |
| `DATABASE_URL` | SQLite database file path | Yes |

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev/)
- [React Documentation](https://react.dev/)

## 📖 Sources

This project was built with guidance from the following official documentation:

- [Upgrading to Prisma 7 - Prisma ORM Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Authentication Guide - Next.js Documentation](https://nextjs.org/docs/app/guides/authentication)
- [Zod - TypeScript-first Schema Validation](https://zod.dev/)

## 📄 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a private project. If you have access and would like to contribute, please follow standard Git workflow practices.
