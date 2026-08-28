"use client";

import {
  ArrowRightLeft,
  MessageSquareText,
  UserPlus2,
  CircleDotDashed,
} from "lucide-react";
import {
  DARK_GREEN,
  TEAL_PRIMARY,
  TEAL_HOVER,
  LIGHT_TEAL_BG,
  LIGHT_TEAL_BG_ALT,
  BODY_TEXT_GREY,
  PRIMARY_TEXT,
  PAGE_BACKGROUND,
  BORDER_GREY,
  MUTED_GREY_GREEN,
} from "@/lib/colors";
import { FONT_FAMILY, HEADING_SM, BODY_SM, CAPTION_REGULAR } from "@/lib/fonts";

type ActivityType = "status" | "comment" | "assignment" | string;

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string;
  actor?: string;
};

type RecentActivityProps = {
  activities: ActivityItem[];
  title?: string;
};

const typeMap: Record<
  "status" | "comment" | "assignment",
  { icon: typeof CircleDotDashed; bg: string; color: string }
> = {
  status: {
    icon: ArrowRightLeft,
    bg: LIGHT_TEAL_BG,
    color: DARK_GREEN,
  },
  comment: {
    icon: MessageSquareText,
    bg: LIGHT_TEAL_BG_ALT,
    color: PRIMARY_TEXT,
  },
  assignment: {
    icon: UserPlus2,
    bg: "rgba(47, 217, 196, 0.14)",
    color: DARK_GREEN,
  },
};

export default function RecentActivity({
  activities,
  title = "Recent Activity",
}: RecentActivityProps) {
  return (
    <section
      className="rounded-2xl border p-5 shadow-sm transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
      style={{
        backgroundColor: PAGE_BACKGROUND,
        borderColor: BORDER_GREY,
      }}
    >
      <div className="mb-4">
        <h3
          style={{
            color: PRIMARY_TEXT,
            fontFamily: FONT_FAMILY.primary,
            fontSize: HEADING_SM.size,
            fontWeight: HEADING_SM.weight,
            lineHeight: HEADING_SM.lineHeight,
            letterSpacing: HEADING_SM.letterSpacing,
          }}
        >
          {title}
        </h3>
        <p
          className="mt-1"
          style={{
            color: BODY_TEXT_GREY,
            fontFamily: FONT_FAMILY.primary,
            fontSize: CAPTION_REGULAR.size,
            lineHeight: CAPTION_REGULAR.lineHeight,
          }}
        >
          Latest ticket events across statuses, comments, and assignments.
        </p>
      </div>

      <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <div
            className="rounded-xl border border-dashed p-6 text-center"
            style={{
              borderColor: BORDER_GREY,
              backgroundColor: LIGHT_TEAL_BG_ALT,
              color: BODY_TEXT_GREY,
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_SM.size,
              lineHeight: BODY_SM.lineHeight,
            }}
          >
            No recent activity available.
          </div>
        ) : (
          activities.map((activity) => {
            const config =
              typeMap[activity.type as keyof typeof typeMap] ?? typeMap.status;
            const Icon = config.icon;

            return (
              <article
                key={activity.id}
                className="flex gap-4 rounded-2xl border p-4 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
                style={{
                  backgroundColor: PAGE_BACKGROUND,
                  borderColor: BORDER_GREY,
                }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: config.bg,
                    color: config.color,
                  }}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p
                        className="truncate"
                        style={{
                          color: PRIMARY_TEXT,
                          fontFamily: FONT_FAMILY.primary,
                          fontSize: BODY_SM.size,
                          fontWeight: HEADING_SM.weight,
                          lineHeight: BODY_SM.lineHeight,
                        }}
                      >
                        {activity.title}
                      </p>
                      {activity.description ? (
                        <p
                          className="mt-1"
                          style={{
                            color: BODY_TEXT_GREY,
                            fontFamily: FONT_FAMILY.primary,
                            fontSize: CAPTION_REGULAR.size,
                            lineHeight: CAPTION_REGULAR.lineHeight,
                          }}
                        >
                          {activity.description}
                        </p>
                      ) : null}
                    </div>

                    <span
                      className="whitespace-nowrap"
                      style={{
                        color: BODY_TEXT_GREY,
                        fontFamily: FONT_FAMILY.primary,
                        fontSize: CAPTION_REGULAR.size,
                        lineHeight: CAPTION_REGULAR.lineHeight,
                      }}
                    >
                      {activity.timestamp}
                    </span>
                  </div>

                  {activity.actor ? (
                    <p
                      className="mt-2"
                      style={{
                        color: DARK_GREEN,
                        fontFamily: FONT_FAMILY.primary,
                        fontSize: CAPTION_REGULAR.size,
                        fontWeight: 500,
                        lineHeight: CAPTION_REGULAR.lineHeight,
                      }}
                    >
                      by {activity.actor}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
