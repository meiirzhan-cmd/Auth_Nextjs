import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

/**
 * Data Access Layer (DAL)
 * Centralizes data requests and authorization logic
 */

/**
 * Verifies the user's session and returns session data
 * Uses React's cache API to memoize during a render pass
 * This is the primary auth check - use before any protected operations
 */
export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.userId as string,
    email: session.email as string,
    name: session.name as string,
  };
});

/**
 * Gets user data from the database
 * Includes auth check via verifySession()
 * Returns only necessary user fields (DTO pattern)
 */
export const getUser = cache(async () => {
  const session = await verifySession();

  if (!session) {
    return null;
  }

  try {
    // Fetch user from database with only necessary fields
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      // Explicitly return only the columns needed (DTO pattern)
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // password is explicitly excluded for security
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
});

/**
 * Optimistic session check without database access
 * Use for middleware and initial route checks
 * Does NOT redirect - returns null if not authenticated
 */
export const verifySessionOptimistic = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return null;
  }

  return {
    isAuth: true,
    userId: session.userId as string,
    email: session.email as string,
    name: session.name as string,
  };
});

/**
 * Checks if user has admin role
 * Extend this based on your role system
 */
export const isAdmin = cache(async () => {
  const session = await verifySession();
  // Extend with actual role checking logic from your database
  // For now, returns false - implement role-based access control as needed
  return false;
});

/**
 * Gets user profile with permission-based field visibility
 * Example of DTO pattern with conditional field exposure
 */
export const getUserProfile = cache(async (userId: string) => {
  const session = await verifySession();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return null;
    }

    // Only show email if viewing own profile
    const canSeeEmail = session.userId === userId;

    return {
      id: user.id,
      name: user.name,
      email: canSeeEmail ? user.email : null,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
});
