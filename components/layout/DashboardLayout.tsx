import { ReactNode } from "react";
import { PAGE_BACKGROUND } from "@/lib/colors";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";

interface DashboardLayoutProps {
  children: ReactNode;
  userName: string;
  userInitials: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  role?: "EMPLOYEE" | "TECHNICIAN" | "ADMIN";
}

export function DashboardLayout({
  children,
  userName,
  userInitials,
  onSearch,
  searchValue,
  role = "TECHNICIAN",
}: DashboardLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: PAGE_BACKGROUND }}
    >
      <Sidebar role={role} />

      <div className="flex-1 lg:pl-[280px] flex flex-col pb-[96px] md:pb-[96px] lg:pb-[96px]">
        <DashboardHeader
          userName={userName}
          userInitials={userInitials}
          onSearch={onSearch}
          searchValue={searchValue}
          role={role}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40">
        <Footer />
      </div>
    </div>
  );
}
