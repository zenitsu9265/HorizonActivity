import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get("activityId");
    const date = searchParams.get("date");

    if (!activityId || !date) {
      return NextResponse.json(
        { ok: false, error: "activityId and date are required" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: { id: true, name: true, maxSeats: true },
    });

    if (!activity) {
      return NextResponse.json(
        { ok: false, error: "Activity not found" },
        { status: 404 }
      );
    }

    const bookingDate = new Date(date);
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedSeats = await prisma.booking.count({
      where: {
        activityId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: "CONFIRMED",
      },
    });

    const available = activity.maxSeats - bookedSeats;

    return NextResponse.json({
      ok: true,
      activityId: activity.id,
      activityName: activity.name,
      date,
      maxSeats: activity.maxSeats,
      bookedSeats,
      availableSeats: available,
      isAvailable: available > 0,
    });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
