import Link from "next/link";
import { Mountain, Search } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { UserMenu } from "@/components/layout/user-menu";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        {user?.role === "ADMIN" ? (
          <span className="flex items-center gap-2 cursor-default select-none">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <Mountain className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Horizon<span className="text-brand-700">Activity</span>
            </span>
          </span>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <Mountain className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Horizon<span className="text-brand-700">Activity</span>
            </span>
          </Link>
        )}

        <div className="flex items-center gap-2">
          {user?.role !== "ADMIN" ? (
            <Link
              href="/activities"
              aria-label="Search activities"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted transition-colors hover:border-brand-500 hover:text-brand-700 lg:flex"
            >
              <Search className="h-4 w-4" />
            </Link>
          ) : null}
          {user && user.role !== "ADMIN" ? (
            <UserMenu
              user={{
                name: user.name,
                email: user.email,
                role: user.role,
                walletBalance: user.walletBalance,
              }}
            />
          ) : user?.role === "ADMIN" ? null : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
