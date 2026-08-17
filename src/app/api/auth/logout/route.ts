import { clearSessionCookie } from "@/lib/auth";
import { ok } from "@/lib/api";

export const runtime = "nodejs";

export async function POST() {
  const res = ok({ message: "Signed out" });
  clearSessionCookie(res);
  return res;
}
