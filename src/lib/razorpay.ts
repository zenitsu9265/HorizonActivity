import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "placeholder",
});

export function razorpayKeyId(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
}

export function isRazorpayConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  return key.startsWith("rzp_") && secret.length > 0;
}
