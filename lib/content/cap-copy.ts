/**
 * Long-form copy for the four headwear pages.
 *
 * These four styles came over from the Hongyu catalogue as ~400-word template
 * pages that differed only in SKU and photo, and none of them had a single
 * internal link pointing at it. They are the only pages on the site that answer
 * "custom baseball cap / snapback / bucket hat / beanie manufacturer", so they
 * get their own copy here rather than a CMS field: the text is code-reviewed,
 * versioned with the page, and cannot be lost in a catalogue re-sync.
 *
 * Keyed by product slug. Anything not in this map keeps the generic template.
 */

export type CapSpec = { label: string; value: string };
export type CapFaq = { q: string; a: string };

export type CapCopy = {
  /** Absolute <title>, already inside the 60-character SERP budget. */
  title: string;
  /** Meta description, inside the 155-character budget. */
  description: string;
  lead: string;
  sections: { heading: string; paragraphs: string[] }[];
  specs: CapSpec[];
  faqs: CapFaq[];
  siblings: { href: string; label: string }[];
};

const HUB = { href: "/custom-caps-manufacturer", label: "All custom cap manufacturing" };

const COMMON_TAIL: CapSpec[] = [
  { label: "Minimum order", value: "50 pcs per style and colour" },
  { label: "Size range", value: "Adult and kids, graded on the same block" },
  { label: "Bulk lead time", value: "14–21 days after sample approval" },
];

export const CAP_COPY: Record<string, CapCopy> = {
  "custom-baseball-cap-manufacturer": {
    title: "Custom Baseball Cap Manufacturer | Bulk Caps",
    description:
      "Custom baseball caps from 50 pcs: 6-panel structured or unstructured crowns, curved brims, 3D puff embroidery and private label. FOB Guangzhou.",
    lead: "A baseball cap is the one product where a 2 mm error in the crown shows. We cut ours on a 6-panel block in Guangzhou, in structured and unstructured versions, with the crown height and brim curve held to a written spec so the second order matches the first.",
    sections: [
      {
        heading: "Six panels, and why the seam matters",
        paragraphs: [
          "A 6-panel cap is six triangular pieces joined at a button on top. If the panels are cut a few millimetres out, the seams do not meet at the crown and the whole cap twists slightly to one side — subtle enough that a buyer notices the fit without being able to say why. Structured caps hide this better because the buckram interlining holds the front panel rigid; unstructured caps expose it, which is why soft dad caps are harder to make consistently than they look.",
          "We specify crown height, panel width, brim length and brim curve on every order and keep the block with the style. That is what makes a reorder repeatable, and it is the part most sourcing conversations skip.",
        ],
      },
      {
        heading: "Fabric choice drives the hand feel",
        paragraphs: [
          "Bio-washed cotton twill is the standard: soft enough to wear out of the box, firm enough to hold a front panel. Heavyweight brushed cotton gives the heavier, slightly fuzzy hand feel that premium streetwear ranges ask for, and pigment-dyed canvas or cotton produces the washed, uneven surface that fades at the seams — the same logic as a garment-washed hoodie.",
          "Polyester enters when the cap has to hold colour under sun, and acrylic when the budget is tight. We will tell you which one is doing the work in your sample rather than letting the price decide quietly.",
        ],
      },
      {
        heading: "Closures, trims and the small parts",
        paragraphs: [
          "The closure decides whether the cap reads retail or promotional. A plastic snap is fine for team and event work; a metal buckle, a fabric strapback with a metal slider, or a brass eyelet and drawcord set is what makes a cap read as product. The sweatband width and the interior taping get the same attention, because a cap is worn with the inside visible every time it is picked up.",
        ],
      },
    ],
    specs: [
      { label: "Structure", value: "6-panel, structured or unstructured" },
      { label: "Fabric", value: "Bio-washed cotton, brushed cotton, canvas, polyester" },
      { label: "Brim", value: "Curved, length and curve to spec" },
      { label: "Decoration", value: "3D puff embroidery, flat embroidery, print, patches" },
      ...COMMON_TAIL,
    ],
    faqs: [
      {
        q: "What is the difference between structured and unstructured baseball caps?",
        a: "A structured cap has a stiff interlining behind the front panels, so the crown keeps its shape and carries heavy 3D embroidery without collapsing. An unstructured cap has no interlining, so it folds flat and sits closer to the head — the dad-cap look. Structured suits retail and logo-led work; unstructured suits washed, low-profile ranges.",
      },
      {
        q: "Can you embroidery a logo on both the front and the back?",
        a: "Yes. Front marks usually run as 3D puff, back arches and side marks as flat embroidery, because puff on a curved back panel distorts the lettering. Stitch count per placement is quoted, so adding a second mark is priced visibly rather than folded into the unit price.",
      },
      {
        q: "Do you make kids baseball caps?",
        a: "Yes. Kids sizes are graded on the same 6-panel block with a shorter circumference and a closure adjusted for it, not a scaled-down adult cap with the same hardware.",
      },
      {
        q: "How many pieces is the minimum order?",
        a: "50 pieces per style and colour, with mixed sizes inside that 50. A first order can combine adult and kids sizes in the same run.",
      },
    ],
    siblings: [
      { href: "/products/custom-snapback-manufacturer", label: "Custom snapback manufacturing" },
      { href: "/products/custom-bucket-hat-manufacturer", label: "Custom bucket hat manufacturing" },
      { href: "/products/custom-beanie-manufacturer", label: "Custom beanie manufacturing" },
      HUB,
    ],
  },

  "custom-snapback-manufacturer": {
    title: "Custom Snapback Manufacturer | Flat Brim Caps",
    description:
      "Custom snapback hats from 50 pcs: high crown, flat brim, plastic snap closure, 3D puff and flat embroidery, woven patches. Made in Guangzhou.",
    lead: "A snapback is a shape decision before it is a decoration decision: high crown, flat brim, structured front. Get the crown height wrong and the cap reads like a baseball cap with the brim ironed flat. We build them on a dedicated block, in the widths and heights streetwear buyers actually ask for.",
    sections: [
      {
        heading: "High crown, flat brim, and the proportions that follow",
        paragraphs: [
          "The snapback silhouette is defined by a taller, blockier front panel and a brim that stays flat instead of curving around the head. That extra height is what allows a large front embroidery — a wordmark across the whole panel, a crest, a box logo — without the design being cut off by the curve. It also means the cap has to be graded differently from a baseball cap rather than relabelled.",
          "Brim width is the second variable. A slightly narrower brim reads as a modern streetwear proportion; a wide brim reads as early-90s and works with heavier fabrics. We hold both on file as separate blocks so a reorder does not drift.",
        ],
      },
      {
        heading: "Where the decoration goes",
        paragraphs: [
          "Most snapbacks carry one large front mark in 3D puff, then smaller marks on the side panel, the back arch above the closure, or the brim edge. Flat embroidery on the side panel and a woven or leather patch on the front are the two combinations that separate a premium snapback from a promo one, and both change the sample cost, so they are quoted separately.",
          "Screen print on a snapback is possible but rare: on a structured panel the print sits on top of the interlining and cracks at the panel seam under wear. We will say so rather than take the order.",
        ],
      },
      {
        heading: "Closure and trims",
        paragraphs: [
          "The plastic snapback closure is the default because the cap is named after it, but a metal snap, a leather strap or a hidden adjuster are all available. What usually makes the difference on a retail snapback is the interior: taped seams, a woven interior label and a heavier sweatband. Those are the parts a buyer checks when they pick the cap up in a store.",
        ],
      },
    ],
    specs: [
      { label: "Structure", value: "6-panel, high crown, structured front" },
      { label: "Fabric", value: "Brushed cotton twill, canvas, polyester" },
      { label: "Brim", value: "Flat, width to spec" },
      { label: "Closure", value: "Plastic snap, metal snap or leather strap" },
      { label: "Decoration", value: "3D puff, flat embroidery, woven and leather patches" },
      ...COMMON_TAIL,
    ],
    faqs: [
      {
        q: "Can a snapback be made with a curved brim?",
        a: "Yes, but it stops being a snapback in the way buyers use the word. If you want the high crown with a curved brim, we build it on the snapback block and curve the brim to a specified radius — the result is usually called a high-crown cap rather than a snapback.",
      },
      {
        q: "What stitch count should a front logo be?",
        a: "A wordmark across the full front panel typically lands between 8,000 and 14,000 stitches depending on letter height and density. Dense, tall lettering needs more underlay, which adds both cost and weight to the panel — that is why the panel is graded for it rather than assumed.",
      },
      {
        q: "Do you supply snapbacks with a woven patch instead of embroidery?",
        a: "Yes. Woven patches give a hard edge and hold fine detail that embroidery loses at small size, and leather or suede patches are laser-cut and stitched flat or across a seam. Both are quoted with the placement.",
      },
      {
        q: "What is the minimum order for custom snapbacks?",
        a: "50 pieces per style and colour, mixed sizes allowed. Adult and kids sizes can run together.",
      },
    ],
    siblings: [
      { href: "/products/custom-baseball-cap-manufacturer", label: "Custom baseball cap manufacturing" },
      { href: "/products/custom-bucket-hat-manufacturer", label: "Custom bucket hat manufacturing" },
      { href: "/products/custom-beanie-manufacturer", label: "Custom beanie manufacturing" },
      HUB,
    ],
  },

  "custom-bucket-hat-manufacturer": {
    title: "Custom Bucket Hat Manufacturer | Bulk Bucket Hats",
    description:
      "Custom bucket hats from 50 pcs: short or wide downturned brims, cotton, canvas or pigment-dyed fabric, reversible and packable options. FOB Guangzhou.",
    lead: "Bucket hats came back because they photograph well and pack flat, and both of those things depend on how the brim is built. We make them in Guangzhou with the interlining specified per side, which is what decides whether the hat holds a shape, folds into a pocket, or can be worn inside out.",
    sections: [
      {
        heading: "Brim width and drop",
        paragraphs: [
          "A bucket hat is a crown and a downturned brim, and almost everything buyers react to sits in two numbers: how wide the brim is and how far it drops. A short, close brim reads as a modern streetwear bucket; a wide, deep brim reads as festival and fishing. Both are made on the same crown block with different brim patterns, so the two versions are not a design change, only a spec change.",
          "Stitching matters here more than on a cap. A single row of topstitching along the brim edge is the standard; a double row reads as a heavier, more premium hat and is usually what a retail sample shows when you look closely.",
        ],
      },
      {
        heading: "Interlining decides reversible and packable",
        paragraphs: [
          "The interlining is the stiffening layer between the shell and the lining. Add it to both sides and the hat holds a firm shape but cannot be turned inside out. Add it to one side only and the hat becomes reversible, with the unlined side sitting softer. Drop it entirely and you get the soft, packable hat that folds into a bag — the version most travel and resort ranges order.",
          "Because that single decision changes the product, we confirm it before sampling rather than after. It is also the reason two bucket hats in the same fabric can feel completely different on arrival.",
        ],
      },
      {
        heading: "Washed finishes and where the print goes",
        paragraphs: [
          "Pigment dye and garment wash give the faded, uneven surface that sells a vintage bucket, and they shrink the hat slightly, so the sample is approved after the wash. Embroidery works best on the front crown; screen print works across the brim but cracks at the fold if the brim is unlined and folded repeatedly, so print-led designs usually go on the firmer, lined version.",
        ],
      },
    ],
    specs: [
      { label: "Structure", value: "Crown with downturned brim, short or wide" },
      { label: "Fabric", value: "Cotton, canvas, pigment-dyed cotton, polyester" },
      { label: "Build", value: "Lined, reversible or unlined packable" },
      { label: "Decoration", value: "Embroidery, screen print, woven labels" },
      ...COMMON_TAIL,
    ],
    faqs: [
      {
        q: "Can bucket hats be made reversible?",
        a: "Yes. Reversible means the interlining goes on one side only, so the hat can be turned inside out and the reverse face sits softer. It also means no exposed interior seams, which changes the construction and the price.",
      },
      {
        q: "Which fabric is best for a washed, vintage bucket hat?",
        a: "Cotton or cotton canvas that takes pigment dye. The wash happens after sewing, so seams and the brim edge pick up colour unevenly — that irregularity is the finish, not a defect. The hat is measured and approved after the wash, because the process shrinks it.",
      },
      {
        q: "Can you print all over a bucket hat?",
        a: "All-over print is done on the flat fabric before cutting, so the pattern position has to be set per panel. On an unlined, foldable brim, heavy print can crack along the fold; if the hat will be folded regularly we recommend the lined version or embroidery instead.",
      },
      {
        q: "What is the minimum order for custom bucket hats?",
        a: "50 pieces per style and colour, with mixed sizes inside that 50 and adult and kids sizes available in the same run.",
      },
    ],
    siblings: [
      { href: "/products/custom-baseball-cap-manufacturer", label: "Custom baseball cap manufacturing" },
      { href: "/products/custom-snapback-manufacturer", label: "Custom snapback manufacturing" },
      { href: "/products/custom-beanie-manufacturer", label: "Custom beanie manufacturing" },
      HUB,
    ],
  },

  "custom-beanie-manufacturer": {
    title: "Custom Beanie Manufacturer | Knit Hats & Cuffs",
    description:
      "Custom knit beanies from 50 pcs: rib and cable knits, acrylic and wool blends, cuff embroidery, woven labels and leather tabs. Made in Guangzhou.",
    lead: "A beanie is the lowest-cost item in a winter drop and the easiest to get wrong, because it is bought by feel and fit rather than by look. We knit ours to a stated gauge and cuff length, in acrylic and wool blends, so the stretch and the recovery after wearing are part of the spec instead of a surprise.",
    sections: [
      {
        heading: "Gauge, cuff and the fit nobody specifies",
        paragraphs: [
          "Knit headwear is described by gauge — the number of needles per inch — and that single number sets how tight the knit reads, how much the hat stretches and how quickly it springs back. A coarse gauge gives a chunky, visible stitch; a fine gauge gives a smooth, retail surface. Most sourcing briefs name the yarn and skip the gauge, which is why two black beanies can arrive looking like different products.",
          "Cuff length is the second number. A short single cuff sits above the ears and reads modern; a long double cuff can be folded and reads workwear. Both are knitted to length rather than cut, so the cuff does not unravel.",
        ],
      },
      {
        heading: "Yarn choice and the itch problem",
        paragraphs: [
          "Acrylic is the volume choice: cheap, colour-fast, holds shape and does not felt in the wash. Wool blends give warmth and a softer hand feel but need a stated percentage, because 30% wool and 70% wool wear very differently. Where a brand wants wool warmth without the itch, we recommend a wool-acrylic blend with a brushed interior rather than a pure wool knit.",
          "Colour matching on knitwear is done on the yarn, not the finished hat, so a Pantone reference is matched at yarn stage and confirmed on a knitted swatch.",
        ],
      },
      {
        heading: "Branding a beanie",
        paragraphs: [
          "Beanies carry branding in three places: a woven label sewn into the cuff, a leather or faux-leather tab, or cuff embroidery. Embroidery on a knit has to be stabilised or it sinks into the stitch, so the cuff is either knitted denser for the placement or a patch is used instead. That is a decision made with the artwork, not after it.",
        ],
      },
    ],
    specs: [
      { label: "Knit", value: "Rib knit or cable knit, gauge to spec" },
      { label: "Yarn", value: "Acrylic, wool and wool-acrylic blends" },
      { label: "Cuff", value: "Single or double, knitted to length" },
      { label: "Decoration", value: "Cuff embroidery, woven label, leather tab" },
      ...COMMON_TAIL,
    ],
    faqs: [
      {
        q: "Are custom beanies one size?",
        a: "Most are, because a knit stretches, but the fit is set by the circumference on the needle and the cuff length rather than left to chance. Kids sizes are knitted to a smaller circumference with a shorter cuff.",
      },
      {
        q: "Acrylic or wool for a custom beanie?",
        a: "Acrylic for volume, colour range and easy care; wool or a wool blend when warmth and hand feel are the selling point. Blends are the usual compromise: wool warmth with an acrylic base that holds shape and reduces itch.",
      },
      {
        q: "Can a logo be embroidered on a knit beanie?",
        a: "Yes, on the cuff, but knit embroidery needs stabilising or the stitches sink into the knit. We either knit the cuff denser at the placement or use a woven or leather patch, and the choice follows the artwork size.",
      },
      {
        q: "What is the minimum order for custom beanies?",
        a: "50 pieces per style and colour, with mixed colours and adult or kids sizes inside the same run.",
      },
    ],
    siblings: [
      { href: "/products/custom-baseball-cap-manufacturer", label: "Custom baseball cap manufacturing" },
      { href: "/products/custom-snapback-manufacturer", label: "Custom snapback manufacturing" },
      { href: "/products/custom-bucket-hat-manufacturer", label: "Custom bucket hat manufacturing" },
      HUB,
    ],
  },
};

export const capCopyFor = (slug: string): CapCopy | undefined => CAP_COPY[slug];
