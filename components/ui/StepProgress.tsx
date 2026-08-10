import { Check, ChevronRight } from "lucide-react";
import { TEAL_PRIMARY, DARK_GREEN, BODY_TEXT_GREY, BORDER_GREY, LIGHT_TEAL_BG } from "@/lib/colors";
import { BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

interface StepProgressProps {
  currentStatus: TicketStatus;
}

const steps: { label: TicketStatus }[] = [
  { label: "Open" },
  { label: "In Progress" },
  { label: "Resolved" },
  { label: "Closed" },
];

const statusOrder: Record<TicketStatus, number> = {
  "Open": 0,
  "In Progress": 1,
  "Resolved": 2,
  "Closed": 3,
};

export function StepProgress({ currentStatus }: StepProgressProps) {
  const currentIndex = statusOrder[currentStatus];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={step.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isCompleted ? TEAL_PRIMARY : isCurrent ? LIGHT_TEAL_BG : BORDER_GREY,
                  color: isCompleted ? DARK_GREEN : isCurrent ? TEAL_PRIMARY : BODY_TEXT_GREY,
                  border: isCurrent ? `2px solid ${TEAL_PRIMARY}` : "none",
                }}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span
                    style={{
                      fontFamily: FONT_FAMILY.primary,
                      fontSize: BODY_SM.size,
                      lineHeight: BODY_SM.lineHeight,
                      fontWeight: FONT_WEIGHT.semibold,
                      letterSpacing: BODY_SM.letterSpacing,
                    }}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className="mt-2 text-center"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_SM.size,
                  lineHeight: BODY_SM.lineHeight,
                  fontWeight: isCurrent ? FONT_WEIGHT.semibold : FONT_WEIGHT.medium,
                  letterSpacing: BODY_SM.letterSpacing,
                  color: isCurrent ? DARK_GREEN : BODY_TEXT_GREY,
                }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="mx-2 flex-1 h-0.5"
                style={{
                  backgroundColor: isCompleted ? TEAL_PRIMARY : BORDER_GREY,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
