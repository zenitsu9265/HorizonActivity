import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatINR } from "@/lib/utils";
import { toggleUserRole } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin · Users" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { bookings: true, cardOrders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-muted">{users.length} registered accounts.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Wallet</th>
              <th className="px-4 py-3 font-medium">Bookings</th>
              <th className="px-4 py-3 font-medium">Cards</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </td>
                <td className="px-4 py-3 font-semibold">{formatINR(user.walletBalance)}</td>
                <td className="px-4 py-3">{user._count.bookings}</td>
                <td className="px-4 py-3">{user._count.cardOrders}</td>
                <td className="px-4 py-3 text-muted">{formatDateTime(user.createdAt)}</td>
                <td className="px-4 py-3">
                  <Badge tone={user.role === "ADMIN" ? "blue" : "neutral"}>{user.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <form action={toggleUserRole.bind(null, user.id)}>
                      <Button size="sm" variant="ghost">
                        Make {user.role === "ADMIN" ? "user" : "admin"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
