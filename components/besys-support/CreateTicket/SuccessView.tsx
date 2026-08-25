import {
  DARK_GREEN,
  TEAL_PRIMARY,
  PAGE_BACKGROUND,
  BORDER_GREY,
  BODY_TEXT_GREY,
  LIGHT_TEAL_BG,
} from "@/lib/colors";
import { HEADING_LG, BODY_REGULAR, FONT_FAMILY } from "@/lib/fonts";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export function SuccessView() {
  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: PAGE_BACKGROUND }}
    >
      <Sidebar role="EMPLOYEE" />
      <div className="flex-1 lg:ml-[280px]">
        <DashboardHeader userName="Jamie Smith" userInitials="JS" />
        <main className="flex items-center justify-center p-6 lg:p-8 min-h-[calc(100vh-73px)]">
          <Card
            variant="elevated"
            className="p-8 text-center max-w-md"
            style={{ borderColor: BORDER_GREY }}
          >
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: LIGHT_TEAL_BG }}
            >
              <svg
                className="h-8 w-8"
                style={{ color: TEAL_PRIMARY }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
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
              Ticket Created Successfully
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
              Your ticket has been submitted. You will be redirected to the
              dashboard shortly.
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
}
