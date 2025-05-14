import { z } from "zod";

export const credentialsSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Email tidak valid" })
      ,
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter" })
      .max(100, { message: "Password terlalu panjang" })
      .regex(/[A-Z]/, { message: "Password harus mengandung huruf besar" })
      .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil" })
      .regex(/[0-9]/, { message: "Password harus mengandung angka" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password harus mengandung simbol (contoh: @, !, #)",
      }),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .regex(/^(\+62|0)[0-9]{9,15}$/, {
        message: "Nomor HP harus berformat Indonesia dan 9–15 digit",
      })
      .refine((val) => !val.includes(" "), {
        message: "Nomor HP tidak boleh mengandung spasi",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak cocok",
  });
