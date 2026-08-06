import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DARK_GREEN, TEAL_PRIMARY, MUTED_GREY_GREEN } from "@/lib/colors";
import { HEADING_LG, BODY_XL, BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { Badge } from "@/components/ui/Badge";

export function LoginLeftPanel() {
  return (
    <div className="relative flex flex-col justify-center px-8 py-10 text-white sm:px-10 lg:px-12 lg:py-14" style={{ backgroundColor: DARK_GREEN }}>
      <Link href="/" className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white/90 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2" style={{ fontFamily: FONT_FAMILY.primary, fontSize: BODY_SM.size, lineHeight: BODY_SM.lineHeight, fontWeight: FONT_WEIGHT.medium, letterSpacing: BODY_SM.letterSpacing, '--tw-ring-color': TEAL_PRIMARY, '--tw-ring-offset-color': DARK_GREEN } as React.CSSProperties}>
        <ArrowLeft className="h-4 w-4" />
        Back to support portal
      </Link>

      <Badge variant="teal" className="inline-flex w-fit">
        CLIENT ACCESS
      </Badge>

      <h1 
        className="mt-4 sm:text-4xl"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: HEADING_LG.size,
          lineHeight: HEADING_LG.lineHeight,
          fontWeight: HEADING_LG.weight,
          letterSpacing: HEADING_LG.letterSpacing,
          color: 'white',
        }}
      >Welcome back</h1>
      <p 
        className="mt-4 max-w-md"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_XL.size,
          lineHeight: BODY_XL.lineHeight,
          fontWeight: BODY_XL.weight,
          letterSpacing: BODY_XL.letterSpacing,
          color: MUTED_GREY_GREEN,
        }}
      >
        Sign in with your BESYS client credentials to continue tracking support requests.
      </p>

      <div className="pointer-events-none absolute bottom-4 right-4 opacity-40 lg:bottom-6 lg:right-6">
        <Image 
          src="/besys-logo.jpg" 
          alt="BESYS Technologies PLC logo" 
          width={96} 
          height={96}
          style={{ mixBlendMode: 'screen', borderRadius: '50%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
