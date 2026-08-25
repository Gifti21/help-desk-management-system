import { Link2, MessageSquareText, ShieldCheck } from "lucide-react";
import { DARK_GREEN, TEAL_PRIMARY, BORDER_GREY, BODY_TEXT_GREY, SECONDARY_BACKGROUND } from "@/lib/colors";
import { HEADING_MD, BODY_REGULAR, FONT_FAMILY } from "@/lib/fonts";
import { Card } from "@/components/ui/card";

const featureCards = [
  {
    icon: Link2,
    title: "Skip the queue",
    description:
      "Log a ticket directly with BESYS instead of bouncing between inboxes and phone handoffs.",
  },
  {
    icon: MessageSquareText,
    title: "Track every answer",
    description:
      "Keep the full audit trail of your correspondence in one place from first reply to resolution.",
  },
  {
    icon: ShieldCheck,
    title: "Secure, dedicated access",
    description:
      "Share only what your assigned support team needs and keep sensitive requests private within BESYS.",
  },
];

export function FeaturesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8" style={{ backgroundColor: SECONDARY_BACKGROUND }}>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        {featureCards.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: {
    icon: any;
    title: string;
    description: string;
  };
}

function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;
  return (
    <Card
      variant="elevated"
      className="group p-8 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: BORDER_GREY }}
    >
      <div className="inline-flex rounded-2xl p-3 transition duration-200" style={{ backgroundColor: DARK_GREEN, color: TEAL_PRIMARY }}>
        <Icon className="h-6 w-6" />
      </div>
      <h3
        className="mt-6"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: HEADING_MD.size,
          lineHeight: HEADING_MD.lineHeight,
          fontWeight: HEADING_MD.weight,
          letterSpacing: HEADING_MD.letterSpacing,
          color: DARK_GREEN,
        }}
      >{feature.title}</h3>
      <p
        className="mt-3"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_REGULAR.size,
          lineHeight: BODY_REGULAR.lineHeight,
          fontWeight: BODY_REGULAR.weight,
          letterSpacing: BODY_REGULAR.letterSpacing,
          color: BODY_TEXT_GREY,
        }}
      >{feature.description}</p>
    </Card>
  );
}
