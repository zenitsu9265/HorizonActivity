import { createHmac } from "crypto";
import { requireUser } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { verifyPaymentSchema } from "@/lib/validators";
import { assertSameOrigin, fail, handleRouteError, ok } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!assertSameOrigin(request)) {
      return fail("Invalid request origin", 403);
    }
    const user = await requireUser();

    const body = await request.json();
    const data = verifyPaymentSchema.parse(body);

    const order = await prisma.cardOrder.findUnique({
      where: { orderNumber: data.orderNumber },
      include: { cardPlan: true },
    });

    if (!order || order.userId !== user.id) {
      return fail("Order not found", 404);
    }

    if (order.status === "PAID") {
      return ok({ message: "Already verified", walletBalance: user.walletBalance });
    }

    if (order.status !== "PENDING") {
      return fail("Order is not pending", 400);
    }

    const expectedSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET ?? "",
    )
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== data.razorpay_signature) {
      return fail("Payment signature verification failed", 400);
    }

    let paymentConfirmed = false;
    try {
      const payment = await razorpay.payments.fetch(data.razorpay_payment_id);
      paymentConfirmed =
        payment.order_id === data.razorpay_order_id &&
        Number(payment.amount) === order.amount &&
        payment.status === "captured";
    } catch (err) {
      console.error("[razorpay] payment fetch failed", err);
    }

    if (!paymentConfirmed) {
      return fail("Payment could not be confirmed", 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.cardOrder.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          razorpayPaymentId: data.razorpay_payment_id,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { walletBalance: { increment: order.cardValue } },
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "CREDIT",
          amount: order.cardValue,
          description: `Booking card credited - ${order.cardPlan?.name ?? "Card"}`,
          cardOrderId: order.id,
        },
      });

      const updated = await tx.user.findUnique({
        where: { id: user.id },
        select: { walletBalance: true },
      });
      return updated?.walletBalance ?? user.walletBalance + order.cardValue;
    });

    return ok({
      message: "Card activated",
      walletBalance: result,
      cardValue: order.cardValue,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
