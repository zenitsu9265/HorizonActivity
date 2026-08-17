"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    setShowConfirm(true);
  }

  async function confirmCancel() {
    setShowConfirm(false);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Could not cancel booking");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel booking");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleCancel} disabled={loading}>
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Undo2 className="h-3.5 w-3.5" />
        )}
        Cancel &amp; refund
      </Button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}

      <ConfirmDialog
        open={showConfirm}
        title="Cancel booking?"
        description="The full amount will be refunded to your wallet instantly. This action cannot be undone."
        confirmLabel="Yes, cancel & refund"
        onConfirm={confirmCancel}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
