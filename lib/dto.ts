import "server-only";
import { getUser } from "@/lib/dal";
import prisma from "@/lib/prisma";

/**
 * Data Transfer Objects (DTOs)
 *
 * DTOs ensure only safe, necessary data is exposed to clients.
 * Use these functions to control what data different users can see.
 */

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Determines if viewer can see user's email
 * Extend with your business logic
 */
function canSeeEmail(viewer: User, targetUserId: string): boolean {
  // Only allow users to see their own email
  return viewer.id === targetUserId;
}

/**
 * Determines if viewer can see user's creation date
 * Extend with your business logic (e.g., admin-only, same team, etc.)
 */
function canSeeCreatedAt(viewer: User): boolean {
  // For now, everyone can see creation dates
  // Extend with role checking: viewer.role === 'admin'
  return true;
}

/**
 * Gets a user profile with permission-based field visibility
 * Only returns data the current viewer is allowed to see
 *
 * Example usage in a Server Component or Server Action:
 * const profile = await getProfileDTO('user-id-123')
 */
export async function getProfileDTO(targetUserId: string) {
  // Get current user (verifies session)
  const currentUser = await getUser();

  if (!currentUser) {
    return null;
  }

  // Fetch target user data
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!targetUser) {
    return null;
  }

  // Return only what the viewer is allowed to see
  return {
    id: targetUser.id,
    name: targetUser.name,
    email: canSeeEmail(currentUser, targetUserId) ? targetUser.email : null,
    createdAt: canSeeCreatedAt(currentUser) ? targetUser.createdAt : null,
  };
}

/**
 * Gets a public user profile (minimal data)
 * Use for displaying user info in public contexts (comments, posts, etc.)
 */
export async function getPublicProfileDTO(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      // Explicitly exclude email, password, and other sensitive fields
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
  };
}

/**
 * Gets current user's own profile (full access to own data)
 */
export async function getOwnProfileDTO() {
  const currentUser = await getUser();

  if (!currentUser) {
    return null;
  }

  // User can see all their own data
  return {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    createdAt: currentUser.createdAt,
    updatedAt: currentUser.updatedAt,
  };
}

/**
 * Example: Admin-only user list DTO
 * Extend with actual role checking
 */
export async function getAllUsersDTO() {
  const currentUser = await getUser();

  if (!currentUser) {
    return null;
  }

  // TODO: Add role checking
  // if (currentUser.role !== 'admin') {
  //   throw new Error('Unauthorized: Admin access required')
  // }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      // password explicitly excluded
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}
