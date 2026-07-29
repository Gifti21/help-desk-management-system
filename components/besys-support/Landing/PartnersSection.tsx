import { DARK_GREEN, BORDER_GREY, BODY_TEXT_GREY, SECONDARY_BACKGROUND, LIGHT_BORDER } from "@/lib/colors";
import { BODY_LG, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

export function PartnersSection() {
  return (
    <section className="border-t px-4 py-8 text-center sm:px-6 lg:px-8" style={{ borderColor: BORDER_GREY, backgroundColor: SECONDARY_BACKGROUND }}>
      <div 
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 font-semibold uppercase"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_LG.size,
          lineHeight: BODY_LG.lineHeight,
          fontWeight: FONT_WEIGHT.semibold,
          letterSpacing: BODY_LG.letterSpacing,
          color: BODY_TEXT_GREY,
        }}
      >
        <span>PARTNERING WITH</span>
        <span className="rounded-full border bg-white px-6 py-3" style={{ borderColor: LIGHT_BORDER, color: DARK_GREEN }}>
          Huawei
        </span>
        <span className="rounded-full border bg-white px-6 py-3" style={{ borderColor: LIGHT_BORDER, color: DARK_GREEN }}>
          Microsoft
        </span>
        <span className="rounded-full border bg-white px-6 py-3" style={{ borderColor: LIGHT_BORDER, color: DARK_GREEN }}>
          + More
        </span>
      </div>
    </section>
  );
}
