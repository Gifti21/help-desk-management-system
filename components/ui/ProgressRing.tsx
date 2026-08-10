import { useEffect, useRef, useState } from "react";
import { TEAL_PRIMARY } from "@/lib/colors";

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  className?: string;
}

export function ProgressRing({
  percentage,
  size = 48,
  strokeWidth = 3,
  color = TEAL_PRIMARY,
  trackColor = "rgba(255, 255, 255, 0.1)",
  className = "",
}: ProgressRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ringRef.current) {
      observer.observe(ringRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div ref={ringRef} className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
    </div>
  );
}
