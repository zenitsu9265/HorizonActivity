import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { handleRouteError, ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    const valid =
      user && (await bcrypt.compare(data.password, user.passwordHash));

    if (!user || !valid) {
      return fail("Invalid email or password", 401);
    }

    const token = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const res = ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        walletBalance: user.walletBalance,
      },
    });
    setSessionCookie(res, token);
    return res;
  } catch (error) {
    return handleRouteError(error);
  }
}
