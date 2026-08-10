import { TEAL_PRIMARY, DARK_GREEN, BORDER_GREY, LIGHT_TEAL_BG, BODY_TEXT_GREY, PRIMARY_TEXT } from "@/lib/colors";
import { HEADING_LG, HEADING_MD, HEADING_XL, BODY_REGULAR, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { Card } from "@/components/ui/Card";

const steps = [
  {
    number: "1",
    title: "Log in",
    description: "Use your BESYS-issued credentials to enter the secure client portal.",
  },
  {
    number: "2",
    title: "Submit",
    description: "Create a ticket with the right category, priority, and details in seconds.",
  },
  {
    number: "3",
    title: "Get Answers",
    description: "Track replies from your assigned support team in one organized thread.",
  },
];

export function StepsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 
            className="sm:text-4xl"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: HEADING_LG.size,
              lineHeight: HEADING_LG.lineHeight,
              fontWeight: HEADING_LG.weight,
              letterSpacing: HEADING_LG.letterSpacing,
              color: PRIMARY_TEXT,
            }}
          >
            Resolution in three simple steps
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full" style={{ backgroundColor: TEAL_PRIMARY }} />
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  step: {
    number: string;
    title: string;
    description: string;
  };
}

function StepCard({ step }: StepCardProps) {
  return (
    <Card
      variant="elevated"
      className="group p-8 text-center transition duration-200 ease-out hover:-translate-y-1"
      style={{ borderColor: BORDER_GREY, borderWidth: '1px', borderStyle: 'solid' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderWidth = '1.5px';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(22, 51, 43, 0.16)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderWidth = '1px';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full transition duration-200 ease-out"
        style={{
          backgroundColor: LIGHT_TEAL_BG,
          color: TEAL_PRIMARY,
          fontFamily: FONT_FAMILY.primary,
          fontSize: HEADING_XL.size,
          lineHeight: HEADING_XL.lineHeight,
          fontWeight: HEADING_XL.weight,
          letterSpacing: HEADING_XL.letterSpacing,
        }}
      >
        {step.number}
      </div>
      <h3
        className="mt-6 transition-colors duration-200"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: HEADING_MD.size,
          lineHeight: HEADING_MD.lineHeight,
          fontWeight: HEADING_MD.weight,
          letterSpacing: HEADING_MD.letterSpacing,
          color: PRIMARY_TEXT,
        }}
      >
        {step.title}
      </h3>
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
      >{step.description}</p>
    </Card>
  );
}
