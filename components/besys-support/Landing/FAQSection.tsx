import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TEAL_PRIMARY, DARK_GREEN, BORDER_GREY, BODY_TEXT_GREY, PAGE_BACKGROUND } from "@/lib/colors";
import { HEADING_LG, BODY_REGULAR, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { Card } from "@/components/ui/Card";

const faqs = [
  {
    question: "I don't have a login yet — how do I get one?",
    answer:
      "Access is provisioned by BESYS once your client relationship is established. Please contact your account manager if you are missing your login details.",
  },
  {
    question: "What kind of questions can I submit?",
    answer:
      "You can raise product questions, implementation requests, service issues, and technical follow-ups related to your BESYS relationship.",
  },
  {
    question: "Is my data kept confidential?",
    answer:
      "Yes. Your submissions are only visible to your assigned support team, and the portal is designed for secure client collaboration.",
  },
  {
    question: "Can multiple people from my company use one account?",
    answer:
      "Each client account is assigned to a specific support context, so access is managed by BESYS to keep permissions clear and secure.",
  },
];

export function FAQSection() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
      <div className="mx-auto max-w-5xl rounded-[32px] border bg-white p-8 shadow-sm sm:p-10" style={{ borderColor: BORDER_GREY }}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 
            className="sm:text-4xl"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: HEADING_LG.size,
              lineHeight: HEADING_LG.lineHeight,
              fontWeight: HEADING_LG.weight,
              letterSpacing: HEADING_LG.letterSpacing,
              color: DARK_GREEN,
            }}
          >
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = index === openFaq;
            return (
              <FaqItem key={faq.question} faq={faq} isOpen={isOpen} onToggle={() => setOpenFaq(isOpen ? -1 : index)} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface FaqItemProps {
  faq: {
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ faq, isOpen, onToggle }: FaqItemProps) {
  return (
    <div 
      className="rounded-2xl border"
      style={{ 
        borderColor: BORDER_GREY,
        backgroundColor: isOpen ? PAGE_BACKGROUND : 'white',
        transition: 'background-color 0.2s ease',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 rounded-t-2xl"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_REGULAR.size,
          lineHeight: BODY_REGULAR.lineHeight,
          fontWeight: FONT_WEIGHT.semibold,
          letterSpacing: BODY_REGULAR.letterSpacing,
          color: DARK_GREEN,
          '--tw-ring-color': TEAL_PRIMARY,
          backgroundColor: isOpen ? PAGE_BACKGROUND : 'transparent',
        } as React.CSSProperties}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = PAGE_BACKGROUND;
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        aria-expanded={isOpen}
      >
        <span>{faq.question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5" style={{ color: TEAL_PRIMARY }} /> : <ChevronDown className="h-5 w-5" style={{ color: TEAL_PRIMARY }} />}
      </button>
      {isOpen ? <p 
        className="px-5 pb-5"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_REGULAR.size,
          lineHeight: BODY_REGULAR.lineHeight,
          fontWeight: BODY_REGULAR.weight,
          letterSpacing: BODY_REGULAR.letterSpacing,
          color: BODY_TEXT_GREY,
        }}
      >{faq.answer}</p> : null}
    </div>
  );
}
