import { Mail, Globe2 } from "lucide-react";
import { TEAL_PRIMARY, BODY_TEXT_GREY, BORDER_GREY, LIGHT_BORDER, DARK_GREEN, PAGE_BACKGROUND } from "@/lib/colors";
import { BODY_SM, BODY_REGULAR, FONT_FAMILY } from "@/lib/fonts";

const socialIcons = [
  { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/98585457/admin/feed/posts/" },
  { kind: "instagram", label: "Instagram", href: "https://www.instagram.com/besys_technologies_plc/" },
  { kind: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61555126808510" },
  { kind: "x", label: "X", href: "https://x.com/BESYS133091" },
  { kind: "mail", label: "Email", href: "mailto:support@besys.com" },
  { kind: "globe", label: "Website", href: "#" },
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
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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

export function Footer() {
  return (
    <footer className="border-t px-4 py-10 text-center sm:px-6 lg:px-8" style={{ borderColor: BORDER_GREY, backgroundColor: PAGE_BACKGROUND }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
        <div className="flex items-center gap-2" style={{ color: BODY_TEXT_GREY, fontFamily: FONT_FAMILY.primary, fontSize: BODY_SM.size, lineHeight: BODY_SM.lineHeight }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TEAL_PRIMARY }} />
          <span>All systems operational</span>
        </div>
        <p style={{ color: BODY_TEXT_GREY, fontFamily: FONT_FAMILY.primary, fontSize: BODY_REGULAR.size, lineHeight: BODY_REGULAR.lineHeight }}>
          Questions before logging in? Reach us at support@besys.com or +251 911 234 567.
        </p>
        <p style={{ color: BODY_TEXT_GREY, fontFamily: FONT_FAMILY.primary, fontSize: BODY_SM.size, lineHeight: BODY_SM.lineHeight }}>
          © 2026 BESYS Technologies PLC. All rights reserved.
        </p>
        <div className="mt-2 flex items-center gap-4">
          {socialIcons.map((icon) => (
            <a
              key={icon.label}
              href={icon.href}
              target={icon.kind === "mail" ? undefined : "_blank"}
              rel={icon.kind === "mail" ? undefined : "noopener noreferrer"}
              className="rounded-full border bg-white p-2 transition focus-visible:outline-none focus-visible:ring-2"
              style={{
                color: DARK_GREEN,
                borderColor: LIGHT_BORDER,
                '--tw-ring-color': TEAL_PRIMARY,
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = TEAL_PRIMARY;
                e.currentTarget.style.color = TEAL_PRIMARY;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = LIGHT_BORDER;
                e.currentTarget.style.color = DARK_GREEN;
              }}
              aria-label={icon.label}
            >
              <SocialIcon kind={icon.kind} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
