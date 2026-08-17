"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatINR } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

interface BuyCardButtonProps {
  cardPlanId: string;
  name: string;
  price: number;
  value: number;
  signedIn: boolean;
  userEmail?: string;
  userPhone?: string;
}

export function BuyCardButton({
  cardPlanId,
  name,
  price,
  value,
  signedIn,
  userEmail,
  userPhone,
}: BuyCardButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  async function handleBuy() {
    setError(null);
    if (!signedIn) {
      router.push("/login?redirect=/booking-cards");
      return;
    }
    setShowConfirm(true);
  }

  async function confirmBuy() {
    setShowConfirm(false);
    setLoading(true);
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardPlanId }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok || !orderJson.ok) {
        throw new Error(orderJson.error || "Could not create payment order");
      }

      const { orderNumber, order } = orderJson;
      const key = orderJson.key;

      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!window.Razorpay) {
        throw new Error("Payment gateway could not be loaded");
      }

      const rzp = new window.Razorpay({
        key,
        order_id: order.id,
        amount: order.amount,
        currency: "INR",
        name: "HorizonActivity",
        description: `Booking card - ${name}`,
        prefill: {
          contact: userPhone ?? "",
          email: userEmail ?? "",
        },
        theme: { color: "#059669" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          if (!response.razorpay_payment_id || !response.razorpay_signature) {
            setError("Payment was not completed");
            setLoading(false);
            return;
          }
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderNumber,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyJson = await verifyRes.json();
          if (!verifyRes.ok || !verifyJson.ok) {
            setError(verifyJson.error || "Payment verification failed");
            setLoading(false);
            return;
          }
          setLoading(false);
          router.push(`/account/cards?paid=${orderNumber}`);
          router.refresh();
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment could not be started");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleBuy}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Spinner size={16} /> Starting payment...
          </>
        ) : (
          <>
            Buy for {formatINR(price)}
            <ShieldCheck className="h-4 w-4" />
          </>
        )}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <p className="text-center text-xs text-muted">
        You get {formatINR(value)} of booking credit for {formatINR(price)}
      </p>

      <ConfirmDialog
        open={showConfirm}
        title="Buy booking card?"
        description={`Pay ${formatINR(price)} for the "${name}" card. You will receive ${formatINR(value)} of booking credit in your wallet.`}
        confirmLabel="Proceed to payment"
        onConfirm={confirmBuy}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load payment gateway"));
    document.body.appendChild(script);
  });
}
