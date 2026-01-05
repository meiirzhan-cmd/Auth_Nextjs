"use server";

import { verifySession } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

/**
 * Example Server Actions with DAL pattern
 *
 * IMPORTANT: Always verify session in Server Actions
 * Never trust client-side auth checks alone
 */

/**
 * Example: Update user profile
 * Demonstrates auth check in Server Action
 */
export async function updateProfile(formData: FormData) {
  // 1. Verify session - redirects if not authenticated
  const session = await verifySession();

  // 2. Validate and extract form data
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    return {
      error: "Name is required",
    };
  }

  try {
    // 3. Perform the authorized action
    await prisma.user.update({
      where: {
        id: session.userId,
      },
      data: {
        name: name.trim(),
      },
    });

    // 4. Revalidate any affected pages
    revalidatePath("/home");

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return {
      error: "Failed to update profile",
    };
  }
}

/**
 * Example: Admin-only action
 * Demonstrates role-based authorization
 */
export async function deleteUser(userId: string) {
  // 1. Verify session
  const session = await verifySession();

  // 2. Check if user has admin role
  // TODO: Implement role checking when you add roles to your schema
  // if (session.role !== 'admin') {
  //   return { error: 'Unauthorized: Admin access required' }
  // }

  // 3. Prevent self-deletion
  if (session.userId === userId) {
    return {
      error: "Cannot delete your own account",
    };
  }

  try {
    // 4. Perform the admin action
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return {
      error: "Failed to delete user",
    };
  }
}

/**
 * Example: Protected data mutation
 * User can only modify their own data
 */
export async function updateSettings(settings: {
  emailNotifications?: boolean;
  theme?: "light" | "dark";
}) {
  const session = await verifySession();

  // Validate settings
  if (settings.theme && !["light", "dark"].includes(settings.theme)) {
    return {
      error: "Invalid theme value",
    };
  }

  try {
    // In a real app, you'd have a settings table
    // For now, this is just an example structure
    // await prisma.userSettings.upsert({
    //   where: { userId: session.userId },
    //   update: settings,
    //   create: { userId: session.userId, ...settings }
    // })

    revalidatePath("/settings");

    return {
      success: true,
      message: "Settings updated successfully",
    };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return {
      error: "Failed to update settings",
    };
  }
}

/**
 * Example: Public action that requires auth
 * Creates a post/comment/etc that belongs to authenticated user
 */
export async function createPost(formData: FormData) {
  const session = await verifySession();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    return {
      error: "Title and content are required",
    };
  }

  try {
    // Create post associated with authenticated user
    // In a real app, you'd have a posts table
    // const post = await prisma.post.create({
    //   data: {
    //     title,
    //     content,
    //     authorId: session.userId,
    //   }
    // })

    revalidatePath("/posts");

    return {
      success: true,
      message: "Post created successfully",
      // postId: post.id
    };
  } catch (error) {
    console.error("Failed to create post:", error);
    return {
      error: "Failed to create post",
    };
  }
}
