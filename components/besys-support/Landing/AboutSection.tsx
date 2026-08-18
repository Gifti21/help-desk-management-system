import Image from "next/image";
import { DARK_GREEN, BORDER_GREY, BODY_TEXT_GREY, LIGHT_TEAL_BG } from "@/lib/colors";
import { HEADING_LG, BODY_XL, FONT_FAMILY } from "@/lib/fonts";

export function AboutSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[32px] border bg-white p-8 shadow-sm lg:grid-cols-[0.45fr_0.55fr] lg:p-12" style={{ borderColor: BORDER_GREY }}>
        <div className="flex items-center justify-center rounded-[24px] p-8" style={{ backgroundColor: LIGHT_TEAL_BG }}>
          <Image
            src="/besys-logo.jpg"
            alt="BESYS Technologies PLC logo"
            width={140}
            height={140}
            style={{ mixBlendMode: 'multiply', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>
        <div>
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
            About BESYS Technologies PLC
          </h2>
          <p 
            className="mt-5"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_XL.size,
              lineHeight: BODY_XL.lineHeight,
              fontWeight: BODY_XL.weight,
              letterSpacing: BODY_XL.letterSpacing,
              color: BODY_TEXT_GREY,
            }}
          >
            BESYS Technologies PLC is a leading IT products and services distributor connecting global technology leaders with the regional enterprise landscape. Our partnership with <span className="font-semibold" style={{ color: DARK_GREEN }}>Huawei</span> and <span className="font-semibold" style={{ color: DARK_GREEN }}>Microsoft</span> helps clients gain direct access to technical expertise through this secure support portal.
          </p>
        </div>
      </div>
    </section>
  );
}
