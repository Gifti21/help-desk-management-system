import { BORDER_GREY } from "@/lib/colors";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`animate-pulse rounded-2xl ${className}`}
      style={{
        backgroundColor: BORDER_GREY,
      }}
    />
  );
}
