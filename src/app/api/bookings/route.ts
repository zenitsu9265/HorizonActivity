import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validators";
import { assertSameOrigin, fail, handleRouteError, ok } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!assertSameOrigin(request)) {
      return fail("Invalid request origin", 403);
    }
    const user = await requireUser();

    const body = await request.json();
    const data = createBookingSchema.parse(body);

    const activity = await prisma.activity.findUnique({ where: { id: data.activityId } });
    if (!activity) {
      return fail("Activity not found", 404);
    }

    const date = new Date(data.date);
    date.setHours(12, 0, 0, 0);
    if (date.getTime() < Date.now() - 86400000) {
      return fail("Booking date cannot be in the past", 400);
    }

    if (user.walletBalance < activity.price) {
      return fail(
        "Insufficient wallet balance. Top up by buying a booking card first.",
        400,
      );
    }

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          userId: user.id,
          activityId: activity.id,
          date,
          amount: activity.price,
          status: "CONFIRMED",
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { walletBalance: { decrement: activity.price } },
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "DEBIT",
          amount: activity.price,
          description: `Booking - ${activity.name}`,
          bookingId: created.id,
        },
      });

      return created;
    });

    return ok({ booking });
  } catch (error) {
    return handleRouteError(error);
  }
}
