import { randomUUID } from "crypto";
import { requireUser } from "@/lib/auth";
import { razorpay, razorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validators";
import { assertSameOrigin, fail, handleRouteError, ok } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!assertSameOrigin(request)) {
      return fail("Invalid request origin", 403);
    }
    const user = await requireUser();

    const body = await request.json();
    const data = createOrderSchema.parse(body);

    const plan = await prisma.cardPlan.findUnique({ where: { id: data.cardPlanId } });
    if (!plan || !plan.active) {
      return fail("Card plan not available", 404);
    }

    const orderNumber = `HA-${Date.now().toString(36).toUpperCase()}-${randomUUID()
      .slice(0, 6)
      .toUpperCase()}`;

    if (!isRazorpayConfigured()) {
      return fail("Payment gateway is not configured. Add Razorpay test keys to .env", 500);
    }

    let razorpayOrderId: string | null = null;
    try {
      const rzpOrder = await razorpay.orders.create({
        amount: plan.price,
        currency: "INR",
        receipt: orderNumber,
        notes: { cardPlanId: plan.id, userId: user.id },
      });
      razorpayOrderId = rzpOrder.id;
    } catch (err) {
      console.error("[razorpay] order create failed", err);
      const raw =
        typeof err === "string" ? err : err instanceof Error ? err.message : JSON.stringify(err ?? {});
      const message = /Authentication failed/i.test(raw)
        ? "Razorpay authentication failed. Check your test key id and secret in .env"
        : "Razorpay order could not be created. Check the keys in .env";
      return fail(message, 500);
    }

    await prisma.cardOrder.create({
      data: {
        orderNumber,
        userId: user.id,
        cardPlanId: plan.id,
        cardValue: plan.value,
        amount: plan.price,
        razorpayOrderId,
        status: "PENDING",
      },
    });

    return ok({
      orderNumber,
      order: { id: razorpayOrderId, amount: plan.price, currency: "INR" },
      key: razorpayKeyId(),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
