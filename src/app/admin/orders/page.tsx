import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Card Orders" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.cardOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      cardPlan: { select: { name: true } },
    },
  });

  const paid = orders.filter((o) => o.status === "PAID");
  const revenue = paid.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Card orders</h1>
        <p className="mt-1 text-sm text-muted">
          {orders.length} orders, {paid.length} paid, {formatINR(revenue)} collected.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Card</th>
                <th className="px-4 py-3 font-medium">Credit</th>
                <th className="px-4 py-3 font-medium">Paid</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs">{order.orderNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-xs text-muted">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-3">{order.cardPlan?.name ?? "Card"}</td>
                  <td className="px-4 py-3 font-semibold text-brand-700">
                    {formatINR(order.cardValue)}
                  </td>
                  <td className="px-4 py-3">{formatINR(order.amount)}</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        order.status === "PAID" ? "brand" : order.status === "FAILED" ? "red" : "amber"
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted">No card orders yet.</p>
      )}
    </div>
  );
}
