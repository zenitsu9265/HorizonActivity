import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelBookingSchema } from "@/lib/validators";
import { assertSameOrigin, fail, handleRouteError, ok } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!assertSameOrigin(request)) {
      return fail("Invalid request origin", 403);
    }
    const user = await requireUser();

    const body = await request.json();
    const data = cancelBookingSchema.parse(body);

    const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
    if (!booking || booking.userId !== user.id) {
      return fail("Booking not found", 404);
    }
    if (booking.status !== "CONFIRMED") {
      return fail("Booking is already cancelled", 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED" },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { walletBalance: { increment: booking.amount } },
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "CREDIT",
          amount: booking.amount,
          description: `Refund - cancelled booking`,
          bookingId: booking.id,
        },
      });

      return updated;
    });

    return ok({ booking: result });
  } catch (error) {
    return handleRouteError(error);
  }
}
