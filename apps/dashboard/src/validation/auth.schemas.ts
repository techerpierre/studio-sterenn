import { z } from "zod";

export const signInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const registerSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters long" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const validate2faSchema = z.object({
  pinCode: z.string()
    .min(6, { message: "Code must be 6 characters long" })
    .max(6, { message: "Code must be 6 characters long" }),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type Validate2faSchema = z.infer<typeof validate2faSchema>;