import { getCurrentUser } from "@/lib/auth";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return fail("Not signed in", 401);
  }
  return ok({ user });
}
