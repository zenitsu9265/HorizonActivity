import { Receipt } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime, formatINR } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Transactions" };
export const dynamic = "force-dynamic";

export default async function AccountTransactionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="mt-1 text-sm text-muted">Your complete wallet ledger.</p>
      </div>

      {transactions.length > 0 ? (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-muted">{formatDateTime(tx.createdAt)}</p>
                </div>
                <p
                  className={`flex items-center text-sm font-semibold ${
                    tx.type === "CREDIT" ? "text-brand-700" : "text-red-600"
                  }`}
                >
                  {tx.type === "CREDIT" ? "+" : "-"}
                  {formatINR(tx.amount)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <Receipt className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-3 font-semibold">No transactions yet</p>
          <p className="mt-1 text-sm text-muted">Your wallet activity will appear here.</p>
        </Card>
      )}
    </div>
  );
}
