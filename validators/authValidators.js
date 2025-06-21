import z from 'zod';

export const loginUserSchema = z.object({
    email: z
        .string()
        .trim()
        .email({message:"Please enter a valid email address"})
        .max(30,{message:"Username must be at most 20 characters long"}),
    password:z
        .string()
        .trim()
        .min(6, {message:"Password should be atleast 6 characters long"})
        .max(30,{message:"Password should be atmost 30 characters long"})
})
export const registerUserSchema = loginUserSchema.extend({
    username: z
        .string()
        .trim()
        .min(3,{message:"Username must be at least 3 characters long"})
        .max(30,{message:"Username must be at most 20 characters long"})
})