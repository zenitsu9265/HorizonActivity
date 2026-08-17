import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/account");
  }

  return (
    <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <AccountNav
          user={{ name: user.name, email: user.email, role: user.role, walletBalance: user.walletBalance }}
        />
        {children}
      </div>
    </Container>
  );
}
