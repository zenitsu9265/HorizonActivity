import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function ok<T>(data: T) {
  return json({ ok: true, ...data });
}

export function fail(message: string, status = 400) {
  return json({ ok: false, error: message }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Invalid request";
    return fail(message, 422);
  }
  if (error instanceof Error) {
    if (error.message === "AUTH_REQUIRED") {
      return fail("Please sign in to continue", 401);
    }
    if (error.message === "FORBIDDEN") {
      return fail("You do not have permission to do this", 403);
    }
    console.error("[api]", error);
    return fail(error.message || "Something went wrong", 400);
  }
  console.error("[api]", error);
  return fail("Something went wrong", 500);
}

export function assertSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
