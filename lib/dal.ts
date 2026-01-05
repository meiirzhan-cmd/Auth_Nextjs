import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";
import { redirect } from "next/navigation";

/**
 * Verifies the user's session and returns session data
 * Uses React's cache API to memoize during a render pass
 **/
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
