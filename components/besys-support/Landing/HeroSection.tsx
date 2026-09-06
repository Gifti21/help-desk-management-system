import Link from "next/link";
import { ArrowRight, Clock3, Lock } from "lucide-react";
import { HERO_GRADIENT, TEAL_PRIMARY, MUTED_GREY_GREEN } from "@/lib/colors";
import { HEADING_XL, BODY_XL, BODY_REGULAR, FONT_FAMILY } from "@/lib/fonts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      className="px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-28"
      style={{
        background: `linear-gradient(${HERO_GRADIENT.direction}, ${HERO_GRADIENT.start}, ${HERO_GRADIENT.middle}, ${HERO_GRADIENT.end})`,
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
          <Badge variant="teal">SUPPORT, WITHOUT THE WAIT</Badge>
          <Badge variant="white">For existing BESYS clients only</Badge>
        </div>
        <h1
          className="max-w-4xl break-words text-4xl !leading-tight sm:text-5xl lg:text-6xl"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: HEADING_XL.size,
            lineHeight: HEADING_XL.lineHeight,
            fontWeight: HEADING_XL.weight,
            letterSpacing: HEADING_XL.letterSpacing,
            color: "white",
          }}
        >
          Ask us anything{" "}
          <span
            className="ml-0 inline-block sm:ml-2"
            style={{ color: TEAL_PRIMARY }}
          >
            no emails, no calls
          </span>
          , just answers.
        </h1>
        <p
          className="mt-5 max-w-2xl text-base sm:mt-6 sm:text-xl"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_XL.size,
            lineHeight: BODY_XL.lineHeight,
            fontWeight: BODY_XL.weight,
            letterSpacing: BODY_XL.letterSpacing,
            color: MUTED_GREY_GREEN,
          }}
        >
          Log in directly to submit a ticket, track replies, and reach the right
          BESYS specialists without waiting on a switchboard.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button variant="primary" size="lg">
              Log in to ask a question
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div
          className="mt-6 flex flex-col items-center gap-3 sm:text-base"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_REGULAR.size,
            lineHeight: BODY_REGULAR.lineHeight,
            fontWeight: BODY_REGULAR.weight,
            letterSpacing: BODY_REGULAR.letterSpacing,
            color: MUTED_GREY_GREEN,
          }}
        >
          <p className="flex max-w-xl items-start gap-2 text-left">
            <Clock3 className="h-4 w-4" style={{ color: TEAL_PRIMARY }} />
            Most tickets receive a first reply within 4 business hours.
          </p>
          <p className="flex max-w-xl items-start gap-2 text-left">
            <Lock className="h-4 w-4" style={{ color: TEAL_PRIMARY }} />
            Only your assigned support team can see your tickets — your
            questions stay private within BESYS.
          </p>
        </div>
      </div>
    </section>
  );
}
