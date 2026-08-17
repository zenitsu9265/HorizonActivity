"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Users } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatINR } from "@/lib/utils";

interface BookActivityButtonProps {
  activityId: string;
  activityName: string;
  price: number;
  walletBalance: number;
  signedIn: boolean;
}

interface AvailabilityInfo {
  maxSeats: number;
  bookedSeats: number;
  availableSeats: number;
  isAvailable: boolean;
}

export function BookActivityButton({
  activityId,
  activityName,
  price,
  walletBalance,
  signedIn,
}: BookActivityButtonProps) {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityInfo | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const router = useRouter();

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  const enoughBalance = signedIn && walletBalance >= price;

  useEffect(() => {
    if (!date || !signedIn) {
      setAvailability(null);
      return;
    }

    const checkAvailability = async () => {
      setCheckingAvailability(true);
      try {
        const res = await fetch(
          `/api/availability?activityId=${activityId}&date=${date}`
        );
        const json = await res.json();
        if (json.ok) {
          setAvailability(json);
        }
      } catch {
        // silently fail
      } finally {
        setCheckingAvailability(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 300);
    return () => clearTimeout(timeoutId);
  }, [date, activityId, signedIn]);

  async function handleBook() {
    setError(null);
    setSuccess(null);
    if (!signedIn) {
      router.push(`/login?redirect=/activities/${activityId}`);
      return;
    }
    if (!date) {
      setError("Please choose a booking date");
      return;
    }
    if (availability && !availability.isAvailable) {
      setError("No seats available on this date");
      return;
    }
    setShowConfirm(true);
  }

  async function confirmBook() {
    setShowConfirm(false);
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId, date }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Booking failed");
      }
      setSuccess("Booking confirmed! Amount deducted from your wallet.");
      setDate("");
      setAvailability(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-background p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Wallet balance</span>
          <span className="font-semibold">{formatINR(walletBalance)}</span>
        </div>
        {!signedIn ? (
          <p className="mt-2 text-xs text-muted">
            Sign in to book with your wallet balance.
          </p>
        ) : enoughBalance ? (
          <p className="mt-2 flex items-center gap-1 text-xs text-brand-700">
            <CalendarCheck className="h-3.5 w-3.5" />
            You can book this activity
          </p>
        ) : (
          <p className="mt-2 text-xs text-amber-700">
            Not enough balance. Buy a booking card to top up.
          </p>
        )}
      </div>

      <Field label="Pick a date" htmlFor="booking-date">
        <Input
          id="booking-date"
          type="date"
          value={date}
          min={minDate.toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
        />
      </Field>

      {signedIn && date && (
        <div className="rounded-lg border border-border bg-background p-3">
          {checkingAvailability ? (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Spinner size={14} /> Checking availability...
            </div>
          ) : availability ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-700" />
                <span className="text-sm font-medium">Seats</span>
              </div>
              <div className="text-sm">
                <span
                  className={
                    availability.isAvailable
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {availability.availableSeats}
                </span>
                <span className="text-muted">
                  {" "}of {availability.maxSeats} available
                </span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <Button
        onClick={handleBook}
        disabled={loading || (availability !== null && !availability.isAvailable)}
        size="lg"
        className="w-full"
        variant={signedIn && enoughBalance ? "primary" : "outline"}
      >
        {loading ? (
          <>
            <Spinner size={16} /> Booking...
          </>
        ) : signedIn ? (
          enoughBalance ? (
            availability && !availability.isAvailable ? (
              "Fully booked on this date"
            ) : (
              <>
                Book {activityName} for {formatINR(price)}
              </>
            )
          ) : (
            "Buy a booking card to book"
          )
        ) : (
          "Sign in to book"
        )}
      </Button>

      {success ? (
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">{success}</p>
      ) : null}
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <ConfirmDialog
        open={showConfirm}
        title="Confirm booking"
        description={`Book ${activityName} for ${formatINR(price)} on ${date}? The amount will be deducted from your wallet.`}
        confirmLabel="Book now"
        onConfirm={confirmBook}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
