import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { AdminShell } from "./shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <ThemeProvider>
      <ToastProvider>
        <AdminShell
          role={user.role}
          userName={`${user.firstName} ${user.lastName}`}
        >
          {children}
        </AdminShell>
      </ToastProvider>
    </ThemeProvider>
  );
}
