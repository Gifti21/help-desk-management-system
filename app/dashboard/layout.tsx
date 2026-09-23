import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  if (!user || user.role !== "AGENT") {
    redirect("/login");
  }

  return children;
}
