import { z } from "zod";

export const credentialsSchema = z
  .object({
    email: z.string().email({ message: "Email tidak valid" }),
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter" })
      .max(100),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .regex(/^(\+62|0)[0-9]{9,15}$/, { message: "Nomor HP tidak valid" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak cocok",
  });
