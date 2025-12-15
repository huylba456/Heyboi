import { isEmailExist } from "services/auth.service";
import { z } from "zod";

const passwordSchema = z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" })
    .max(20, { message: "Password must not exceed 20 characters" })
// .refine((password) => /[A-Z]/.test(password), {
//     message: "Password must contain at least one uppercase letter",
// })
// .refine((password) => /[a-z]/.test(password), {
//     message: "Password must contain at least one lowercase letter",
// })
// .refine((password) => /[0-9]/.test(password), {
//     message: "Password must contain at least one number",
// })
// .refine((password) => /[!@#$%^&*]/.test(password), {
//     message: "Password must contain at least one special character",
// });

const emailSchema =
    z.string().email("Invalid email format")
        .refine(async (email) => {
            const existingUser = await isEmailExist(email);
            return !existingUser;
        }, {
            message: "Email is already registered, please use another one",
            path: ["email"],
        });

export const RegisterSchema = z.object({
    name: z.string().trim().min(1, { message: "Name cannot be empty" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match, please try again",
        path: ['confirmPassword'],
    });

export type TRegisterSchema = z.infer<typeof RegisterSchema>;