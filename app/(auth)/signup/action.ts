"use server";

import { FormState, SignupFormSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import * as z from "zod";

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);

    return {
      errors: flattened.fieldErrors,
      formErrors: flattened.formErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      errors: {
        email: ["Email already exists"],
      },
      formErrors: [],
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch {
    return {
      formErrors: ["Something went wrong. Please try again."],
      errors: {},
    };
  }
}
