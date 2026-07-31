"use server";

import core from "@/config/core";
import { getSession } from "@/lib/session-persistence";
import {
  SignInSchema,
  signInSchema,
  RegisterSchema,
  registerSchema,
  validate2faSchema,
  Validate2faSchema,
} from "@/validation/auth.schemas";
import { Profile } from "@sterenn/api-contracts";
import { redirect } from "next/navigation";

export async function signIn(data: SignInSchema): Promise<void> {
  const validatedData = signInSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }
  await core.auth.signIn(validatedData.data);
}

export async function register(data: RegisterSchema): Promise<void> {
  const validatedData = registerSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }

  const { confirmPassword: _confirmPassword, ...registerData } =
    validatedData.data;
  await core.auth.register(registerData);
}

export async function validate2fa(data: Validate2faSchema): Promise<void> {
  const validatedData = validate2faSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }
  await core.auth.validate2FA(validatedData.data);
}

export async function getProfile(): Promise<Profile> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return core.auth.getProfile();
}

export async function signOut(): Promise<void> {
  await core.auth.signOut();
  redirect("/sign-in");
}
