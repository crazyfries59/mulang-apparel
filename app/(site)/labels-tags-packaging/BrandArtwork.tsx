import Image from "next/image";

type ReferencePhoto = {
  file: string;
  alt: string;
  position?: string;
};

const PHOTO_FOLDER = "/images/services/packaging";
const PHOTOS = {
  woven: { file: "garment-neck-label.webp", alt: "Fabric neck label sewn into a striped T-shirt", position: "center 61%" },
  care: { file: "garment-care-label.webp", alt: "Close-up of a sewn clothing label with wool content and wash care symbols" },
  tag: { file: "custom-clothing-hang-tag.webp", alt: "Blank paper hang tag with a string attached to a dark red garment", position: "center 61%" },
  bag: { file: "clear-garment-bag.webp", alt: "Folded denim jeans being placed in a clear garment bag" },
  tissue: { file: "clothing-tissue-wrap.webp", alt: "Folded yellow garment being wrapped in tissue paper", position: "center 58%" },
  box: { file: "retail-apparel-packaging-box.webp", alt: "Folded knitwear presented in a cardboard apparel packaging box" },
} satisfies Record<string, ReferencePhoto>;

type PackagingKind = keyof typeof PHOTOS | "printed" | "patch";

function TrimIllustration({ kind }: { kind: "printed" | "patch" }) {
  const isPrinted = kind === "printed";
  return (
    <div className="relative h-full min-h-44">
      <svg role="img" aria-label={isPrinted ? "Illustration of a heat-transfer neck label on a T-shirt" : "Illustration of a rectangular stitched logo patch"} viewBox="0 0 440 280" className="h-full w-full object-cover">
        <rect width="440" height="280" fill="#17141d" />
        {isPrinted ? (
          <g>
            <path d="M38 280V122Q50 77 145 61Q220 117 295 61Q390 77 402 122V280" fill="#292632" />
            <path d="M145 61Q220 117 295 61" fill="none" stroke="#49424f" strokeWidth="16" />
            <path d="M148 60Q220 108 292 60" fill="none" stroke="#18161f" strokeWidth="8" />
            <text x="220" y="144" textAnchor="middle" fill="#e0d8f4" fontFamily="Georgia,serif" fontSize="24" letterSpacing="4">MULANG</text>
            <text x="220" y="166" textAnchor="middle" fill="#b2a8c1" fontFamily="sans-serif" fontSize="9" letterSpacing="3">APPAREL</text>
          </g>
        ) : (
          <g transform="translate(98 76) rotate(5 122 64)">
            <rect x="7" y="9" width="244" height="128" rx="20" fill="#000" opacity=".3" />
            <rect width="244" height="128" rx="20" fill="#42344f" />
            <rect x="9" y="9" width="226" height="110" rx="14" fill="none" stroke="#8a6b9f" strokeWidth="2" strokeDasharray="3 4" />
            <text x="122" y="70" textAnchor="middle" fill="#d8c7ed" fontFamily="Georgia,serif" fontSize="32" letterSpacing="3">MULANG</text>
            <text x="122" y="92" textAnchor="middle" fill="#b6a0c9" fontFamily="sans-serif" fontSize="10" letterSpacing="4">APPAREL</text>
          </g>
        )}
      </svg>
      <span className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1 text-xs text-zinc-200">Illustration</span>
    </div>
  );
}

export function PackagingVisual({ kind }: { kind: PackagingKind }) {
  if (kind === "printed" || kind === "patch") {
    return <div className="border-b border-white/10 bg-[#17141d]"><TrimIllustration kind={kind} /></div>;
  }

  const photo: ReferencePhoto = PHOTOS[kind];
  const src = `${PHOTO_FOLDER}/${photo.file}`;
  return (
    <a href={src} target="_blank" rel="noopener" aria-label={`Open reference photo: ${photo.alt} (new tab)`} className="group/photo relative block aspect-[11/7] overflow-hidden border-b border-white/10 bg-[#17141d] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-violet-300">
      <Image src={src} alt={photo.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 570px" className="object-cover transition-transform duration-300 group-hover/photo:scale-[1.03] motion-reduce:transform-none" style={{ objectPosition: photo.position }} />
    </a>
  );
}

export function PackagingHeroPhoto() {
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/10 bg-[#14111c]">
      <div className="relative aspect-[5/4] bg-[#211b18]">
        <Image src={`${PHOTO_FOLDER}/folded-knitwear-in-packaging.webp`} alt="Folded knitwear nestled in tissue paper inside a packaging box" fill preload sizes="(max-width: 1023px) 100vw, 580px" className="object-cover object-[center_55%]" />
      </div>
      <figcaption className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-zinc-400">
        Reference photo. Materials, dimensions and artwork are confirmed for your order.
      </figcaption>
    </figure>
  );
}
