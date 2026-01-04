# Auth_Nextjs

A modern authentication and authorization system built with Next.js 16, Prisma 7, and Zod validation.

## 📋 Overview

This project implements a secure authentication system with JWT-based session management, password hashing, and form validation. It demonstrates best practices for building authentication flows in Next.js using the App Router architecture.

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
│   ├── status/              # Status and error components
│   ├── svg/                 # SVG icon components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── definitions.ts       # TypeScript type definitions
│   ├── prisma.ts            # Prisma client configuration
│   ├── session.ts           # Session management utilities
│   ├── login/               # Login-specific utilities
│   └── signup/              # Signup-specific utilities
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── generated/           # Generated Prisma Client
├── .env                     # Environment variables (create this)
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

## 🔒 Security Features

- **Password Hashing**: bcrypt with salting
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS-only in production
- **SameSite Policy**: CSRF protection
- **JWT Encryption**: Signed tokens with secret key
- **Server-Only Code**: Sensitive operations marked with "server-only"

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
