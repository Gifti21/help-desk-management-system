import { useRouter } from "next/navigation";
import { DARK_GREEN, PAGE_BACKGROUND, BORDER_GREY, BODY_TEXT_GREY } from "@/lib/colors";
import { HEADING_LG, BODY_REGULAR, FONT_FAMILY } from "@/lib/fonts";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export function TicketNotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: PAGE_BACKGROUND }}>
      <Sidebar />
      <div className="flex-1 lg:ml-[280px]">
        <DashboardHeader userName="Jamie Smith" userInitials="JS" />
        <main className="flex items-center justify-center p-6 lg:p-8 min-h-[calc(100vh-73px)]">
          <Card variant="elevated" className="p-8 text-center max-w-md" style={{ borderColor: BORDER_GREY }}>
            <h1
              className="mb-3"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: HEADING_LG.size,
                lineHeight: HEADING_LG.lineHeight,
                fontWeight: HEADING_LG.weight,
                letterSpacing: HEADING_LG.letterSpacing,
                color: DARK_GREEN,
              }}
            >
              Ticket Not Found
            </h1>
            <p
              className="mb-6"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_REGULAR.size,
                lineHeight: BODY_REGULAR.lineHeight,
                fontWeight: BODY_REGULAR.weight,
                letterSpacing: BODY_REGULAR.letterSpacing,
                color: BODY_TEXT_GREY,
              }}
            >
              The ticket you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button variant="primary" size="md" onClick={() => router.push("/employee/tickets")}>
              Back to My Tickets
            </Button>
          </Card>
        </main>
      </div>
    </div>
  );
}
