"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock3,
  Globe2,
  Link2,
  Lock,
  Mail,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

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

const socialIcons = [
  { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/98585457/admin/feed/posts/" },
  { kind: "instagram", label: "Instagram", href: "https://www.instagram.com/besys_technologies_plc/" },
  { kind: "x", label: "X", href: "https://x.com/BESYS133091" },
  { kind: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61555126808510" },
  { kind: "mail", label: "Email", href: "mailto:support@besys.com" },
  { kind: "globe", label: "Website", href: "https://besys.com" },
] as const;

function SocialIcon({ kind }: { kind: (typeof socialIcons)[number]["kind"] }) {
  const className = "h-4 w-4";

  switch (kind) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.5h2.88V18H5.5zM10.4 9.5h2.76v1.16h.04c.38-.72 1.32-1.48 2.72-1.48 2.9 0 3.43 1.9 3.43 4.38V18H16.4v-7.5c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.96V18H10.4z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
          <circle cx="12" cy="12" r="4.3" />
          <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M18.9 4H21l-6.8 7.8L22 20h-5.4l-4.2-5.5L7.7 20H5.6l7.2-8.2L2 4h5.5l3.8 5.1L18.9 4Zm-1 14.4h1.1L6.2 5.6H5.1l12.8 12.8Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "mail":
      return <Mail className={className} aria-hidden="true" />;
    case "globe":
      return <Globe2 className={className} aria-hidden="true" />;
    default:
      return null;
  }
}

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9f8] text-[#1a1d1c]">
      <header
        className={`sticky top-0 z-40 border-b text-white shadow-sm transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 ease-out ${
          isScrolled ? "border-white/10 bg-[rgba(22,51,43,0.75)] backdrop-blur-xl" : "border-transparent bg-[#16332b]"
        }`}
        style={{
          backgroundColor: isScrolled ? "rgba(22, 51, 43, 0.75)" : "#16332b",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16332b]">
            <Image
              src="/besys-logo.jpg"
              alt="BESYS Technologies PLC logo"
              width={48}
              height={48}
              priority
            />
            <span className="text-lg font-semibold tracking-[0.2em] text-white sm:text-xl">
              BESYS Support
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16332b]"
              aria-label="Select language"
            >
              <Globe2 className="h-4 w-4" />
              <span>English</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <Link
              href="/login"
              className="rounded-full bg-[#2fd9c4] px-5 py-2.5 text-sm font-semibold text-[#16332b] transition hover:bg-[#24c3b0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16332b]"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[linear-gradient(135deg,_#16332b_0%,_#1f483d_55%,_#16332b_100%)] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-[#2fd9c4]/45 bg-[#2fd9c4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[#8ef1e0]">
                SUPPORT, WITHOUT THE WAIT
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white/85">
                For existing BESYS clients only
              </span>
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Ask us anything — <span className="text-[#2fd9c4]">no emails, no calls</span>, just answers.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#9bb0ab] sm:text-xl">
              Log in directly to submit a ticket, track replies, and reach the right BESYS specialists without waiting on a switchboard.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2fd9c4] px-6 py-3.5 text-base font-semibold text-[#16332b] transition hover:bg-[#24c3b0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#16332b]"
              >
                Log in to ask a question
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-6 flex flex-col items-center gap-3 text-sm text-[#9bb0ab] sm:text-base">
              <p className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#2fd9c4]" />
                Most tickets receive a first reply within 4 business hours.
              </p>
              <p className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#2fd9c4]" />
                Only your assigned support team can see your tickets — your questions stay private within BESYS.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f9f8] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold text-[#1a1d1c] sm:text-4xl">
                Resolution in three simple steps
              </h2>
              <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-[#2fd9c4]" />
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="group rounded-3xl border border-[#e3ece8] bg-white p-8 text-center shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:border-[1.5px] hover:border-[#16332b] hover:shadow-[0_16px_40px_rgba(22,51,43,0.16)]"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e5f9f6] text-2xl font-semibold text-[#2fd9c4] transition duration-200 ease-out group-hover:bg-[#16332b] group-hover:text-[#2fd9c4]">
                    {step.number}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-[#1a1d1c] transition-colors duration-200 group-hover:text-[#16332b]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-[#6b6e6c]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f2f5f4] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-[24px] border border-[#e3ece8] bg-white p-8 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#2fd9c4] hover:shadow-lg"
                >
                  <div className="inline-flex rounded-2xl bg-[#16332b] p-3 text-[#2fd9c4] transition duration-200 group-hover:bg-[#2fd9c4] group-hover:text-[#16332b]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-[#16332b]">{feature.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#6b6e6c]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#16332b] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.2)] sm:p-6 lg:p-7">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute h-2.5 w-2.5 rounded-full bg-[#2fd9c4] shadow-[0_0_0_4px_rgba(47,217,196,0.2)]" />
                <span className="absolute h-4 w-4 rounded-full border border-[#2fd9c4]/50" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#9bb0ab]">
                LIVE SUPPORT STATUS
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6b8079] [font-family:ui-monospace,monospace]">
                  AVG_FIRST_REPLY
                </p>
                <p className="mt-2 text-[28px] font-bold leading-none text-white [font-family:ui-monospace,monospace]">
                  4<span className="ml-1 text-[20px] font-semibold text-[#2fd9c4]">hrs</span>
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6b8079] [font-family:ui-monospace,monospace]">
                  RESOLUTION_RATE
                </p>
                <p className="mt-2 text-[28px] font-bold leading-none text-white [font-family:ui-monospace,monospace]">
                  99<span className="ml-1 text-[20px] font-semibold text-[#2fd9c4]">%</span>
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6b8079] [font-family:ui-monospace,monospace]">
                  TICKET_TRACKING
                </p>
                <p className="mt-2 text-[28px] font-bold leading-none text-white [font-family:ui-monospace,monospace]">
                  24<span className="ml-1 text-[20px] font-semibold text-[#2fd9c4]">/7</span>
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6b8079] [font-family:ui-monospace,monospace]">
                  SYSTEM_STATUS
                </p>
                <p className="mt-2 text-[24px] font-bold uppercase leading-none text-[#2fd9c4] [font-family:ui-monospace,monospace]">
                  OPERATIONAL
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f9f8] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[32px] border border-[#e3ece8] bg-white p-8 shadow-sm lg:grid-cols-[0.45fr_0.55fr] lg:p-12">
            <div className="flex items-center justify-center rounded-[24px] bg-[#e6f8f5] p-8">
              <Image
                src="/besys-logo.jpg"
                alt="BESYS Technologies PLC logo"
                width={140}
                height={140}
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-[#16332b] sm:text-4xl">
                About BESYS Technologies PLC
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#6b6e6c]">
                BESYS Technologies PLC is a leading IT products and services distributor connecting global technology leaders with the regional enterprise landscape. Our partnership with <span className="font-semibold text-[#16332b]">Huawei</span> and <span className="font-semibold text-[#16332b]">Microsoft</span> helps clients gain direct access to technical expertise through this secure support portal.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f9f8] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-[#e3ece8] bg-white p-8 shadow-sm sm:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold text-[#16332b] sm:text-4xl">
                Frequently asked questions
              </h2>
            </div>
            <div className="mt-10 space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = index === openFaq;
                return (
                  <div key={faq.question} className="rounded-2xl border border-[#e3ece8] bg-[#fbfdfc]">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-base font-semibold text-[#16332b] transition hover:bg-[#f7f9f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="h-5 w-5 text-[#2fd9c4]" /> : <ChevronDown className="h-5 w-5 text-[#2fd9c4]" />}
                    </button>
                    {isOpen ? <p className="px-5 pb-5 text-base leading-7 text-[#6b6e6c]">{faq.answer}</p> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-[#e3ece8] bg-[#f2f5f4] px-4 py-8 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#6b6e6c]">
            <span>PARTNERING WITH</span>
            <span className="rounded-full border border-[#dde5e1] bg-white px-4 py-2 text-[#16332b]">
              Huawei
            </span>
            <span className="rounded-full border border-[#dde5e1] bg-white px-4 py-2 text-[#16332b]">
              Microsoft
            </span>
            <span className="rounded-full border border-[#dde5e1] bg-white px-4 py-2 text-[#16332b]">
              + More
            </span>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e3ece8] bg-[#f7f9f8] px-4 py-10 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#6b6e6c]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2fd9c4]" />
            <span>All systems operational</span>
          </div>
          <p className="text-base text-[#6b6e6c]">
            Questions before logging in? Reach us at support@besys.com or +251 911 234 567.
          </p>
          <p className="text-sm text-[#6b6e6c]">© 2026 BESYS Technologies PLC. All rights reserved.</p>
          <div className="mt-2 flex items-center gap-4">
            {socialIcons.map((icon) => (
              <a
                key={icon.label}
                href={icon.href}
                target={icon.kind === "mail" ? undefined : "_blank"}
                rel={icon.kind === "mail" ? undefined : "noopener noreferrer"}
                className="rounded-full border border-[#dce6e2] bg-white p-2 text-[#16332b] transition hover:border-[#2fd9c4] hover:text-[#2fd9c4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fd9c4] focus-visible:ring-offset-2"
                aria-label={icon.label}
              >
                <SocialIcon kind={icon.kind} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
