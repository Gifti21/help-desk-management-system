import { ReactNode } from "react";
import { PAGE_BACKGROUND } from "@/lib/colors";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  userName: string;
  userInitials: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
}

export function DashboardLayout({
  children,
  userName,
  userInitials,
  onSearch,
  searchValue,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: PAGE_BACKGROUND }}>
      <Sidebar />
      
      <div className="flex-1 lg:ml-[280px]">
        <DashboardHeader 
          userName={userName} 
          userInitials={userInitials} 
          onSearch={onSearch}
          searchValue={searchValue}
        />
        
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
