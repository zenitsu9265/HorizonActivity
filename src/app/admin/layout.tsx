import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "ADMIN") redirect("/account");

  return (
    <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <AdminNav />
        {children}
      </div>
    </Container>
  );
}
