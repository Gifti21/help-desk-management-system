import {
  DARK_GREEN,
  TEAL_PRIMARY,
  BODY_TEXT_GREY,
  BORDER_GREY,
} from "@/lib/colors";
import { BODY_XL, BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { Card } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

interface StatCardsProps {
  stats: {
    total: number;
    open: number;
    inProgress: number;
    closed: number;
  };
  isLoading: boolean;
}

export function StatCards({ stats, isLoading }: StatCardsProps) {
  if (isLoading) {
    return (
      <>
        <SkeletonCard className="p-6 h-24" />
        <SkeletonCard className="p-6 h-24" />
        <SkeletonCard className="p-6 h-24" />
        <SkeletonCard className="p-6 h-24" />
      </>
    );
  }

  return (
    <>
      <StatCard label="Total Tickets" value={stats.total} color={DARK_GREEN} />
      <StatCard label="Open" value={stats.open} color={TEAL_PRIMARY} />
      <StatCard
        label="In Progress"
        value={stats.inProgress}
        color={DARK_GREEN}
      />
      <StatCard label="Closed" value={stats.closed} color={BODY_TEXT_GREY} />
    </>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div
      className="p-6 rounded-2xl border bg-white shadow-sm transition-all duration-250 ease-out hover:-translate-y-2"
      style={{
        borderColor: BORDER_GREY,
        boxShadow: "0 16px 40px rgba(22, 51, 43, 0.16)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = TEAL_PRIMARY;
        e.currentTarget.style.boxShadow =
          "0 20px 50px rgba(47, 217, 196, 0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = BORDER_GREY;
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(22, 51, 43, 0.16)";
      }}
    >
      <p
        className="mb-2"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_SM.size,
          lineHeight: BODY_SM.lineHeight,
          fontWeight: FONT_WEIGHT.medium,
          letterSpacing: BODY_SM.letterSpacing,
          color: BODY_TEXT_GREY,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_XL.size,
          lineHeight: BODY_XL.lineHeight,
          fontWeight: FONT_WEIGHT.bold,
          letterSpacing: BODY_XL.letterSpacing,
          color,
        }}
      >
        {value}
      </p>
    </div>
  );
}
