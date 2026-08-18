import { z } from "zod";

const emailSchema = z
  .string({ error: "Email is required" })
  .email("Enter a valid email address")
  .max(254);

export const registerSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72)
    .regex(/[a-zA-Z]/, "Password must contain a letter")
    .regex(/\d/, "Password must contain a number"),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ error: "Password is required" }).min(1),
});

export const createOrderSchema = z.object({
  cardPlanId: z.string().min(1),
});

export const verifyPaymentSchema = z.object({
  orderNumber: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const createBookingSchema = z.object({
  activityId: z.string().min(1),
  date: z.coerce.date(),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1),
});
