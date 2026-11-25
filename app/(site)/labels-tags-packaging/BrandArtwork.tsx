import Image from "next/image";

type ReferencePhoto = {
  file: string;
  alt: string;
  position?: string;
  illustration?: boolean;
};

const PHOTO_FOLDER = "/images/services/packaging";
const PHOTOS = {
  woven: { file: "garment-neck-label.webp", alt: "Fabric neck label sewn into a striped T-shirt", position: "center 61%" },
  printed: { file: "mulang-collar-print.webp", alt: "Illustration of a Mulang logo printed inside a black T-shirt collar", illustration: true },
  patch: { file: "mulang-silicone-patch.webp", alt: "Illustration of a purple Mulang silicone patch on a black hoodie", illustration: true },
  care: { file: "garment-care-label.webp", alt: "Close-up of a sewn clothing label with wool content and wash care symbols" },
  tag: { file: "custom-clothing-hang-tag.webp", alt: "Blank paper hang tag with a string attached to a dark red garment", position: "center 61%" },
  bag: { file: "clear-garment-bag.webp", alt: "Folded denim jeans being placed in a clear garment bag" },
  tissue: { file: "clothing-tissue-wrap.webp", alt: "Folded yellow garment being wrapped in tissue paper", position: "center 58%" },
  box: { file: "retail-apparel-packaging-box.webp", alt: "Folded knitwear presented in a cardboard apparel packaging box" },
} satisfies Record<string, ReferencePhoto>;

type PackagingKind = keyof typeof PHOTOS;

export function PackagingVisual({ kind }: { kind: PackagingKind }) {
  const photo: ReferencePhoto = PHOTOS[kind];
  const src = `${PHOTO_FOLDER}/${photo.file}`;
  return (
    <a href={src} target="_blank" rel="noopener" aria-label={`Open reference image: ${photo.alt} (new tab)`} className="group/photo relative block aspect-[11/7] overflow-hidden border-b border-white/10 bg-[#17141d] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-violet-300">
      <Image src={src} alt={photo.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 570px" className="object-cover transition-transform duration-300 group-hover/photo:scale-[1.03] motion-reduce:transform-none" style={{ objectPosition: photo.position }} />
      {photo.illustration && <span className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1 text-xs text-zinc-200">Illustration</span>}
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
