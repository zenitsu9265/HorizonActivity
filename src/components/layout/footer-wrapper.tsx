import { getCurrentUser } from "@/lib/auth";
import { Footer } from "@/components/layout/footer";

export async function FooterWrapper() {
  const user = await getCurrentUser();
  if (user?.role === "ADMIN") return null;
  return <Footer />;
}
