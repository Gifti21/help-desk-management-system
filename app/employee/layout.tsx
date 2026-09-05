import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";

export default async function EmployeeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  if (!user || user.role !== "EMPLOYEE") {
    redirect("/login");
  }

  return children;
}
