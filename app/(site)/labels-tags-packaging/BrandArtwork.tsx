type ArtworkKind = "woven" | "printed" | "care" | "tag" | "patch" | "bag" | "tissue" | "box";

export function BrandArtwork({ kind, className = "" }: { kind: ArtworkKind; className?: string }) {
  return (
    <svg role="img" aria-label={`Illustrative ${kind} mockup for a clothing brand`} viewBox="0 0 440 280" className={`h-auto w-full ${className}`}>
      <defs>
        <linearGradient id={`surface-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22202e" /><stop offset="1" stopColor="#101016" />
        </linearGradient>
        <linearGradient id={`accent-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#c4b5fd" /><stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <pattern id={`weave-${kind}`} width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 0H5M0 0V5" stroke="#fff" strokeOpacity=".08" strokeWidth=".6" />
        </pattern>
      </defs>
      <rect width="440" height="280" fill={`url(#surface-${kind})`} />
      <circle cx="350" cy="30" r="160" fill="#8b5cf6" opacity=".035" />
      {kind === "woven" && <g transform="translate(76 80) rotate(-6 144 60)">
        <rect x="7" y="9" width="288" height="120" rx="3" fill="#000" opacity=".3" />
        <rect width="288" height="120" rx="3" fill="#d8d1c6" />
        <rect width="288" height="120" rx="3" fill={`url(#weave-${kind})`} />
        <rect x="10" y="10" width="268" height="100" rx="1" fill="none" stroke="#5f5767" strokeDasharray="3 3" />
        <text x="144" y="60" textAnchor="middle" fill="#25202d" fontFamily="Georgia,serif" fontSize="33" letterSpacing="6">MULANG</text>
        <text x="144" y="83" textAnchor="middle" fill="#5f5767" fontFamily="sans-serif" fontSize="11" letterSpacing="5">APPAREL</text>
      </g>}
      {kind === "printed" && <g>
        <path d="M38 280V122Q50 77 145 61Q220 117 295 61Q390 77 402 122V280" fill="#292632" />
        <path d="M145 61Q220 117 295 61" fill="none" stroke="#49424f" strokeWidth="16" />
        <path d="M148 60Q220 108 292 60" fill="none" stroke="#18161f" strokeWidth="8" />
        <text x="220" y="144" textAnchor="middle" fill="#e0d8f4" fontFamily="Georgia,serif" fontSize="24" letterSpacing="4">MULANG</text>
        <text x="220" y="166" textAnchor="middle" fill="#b2a8c1" fontFamily="sans-serif" fontSize="9" letterSpacing="3">APPAREL · YOUR BRAND</text>
        <path d="M200 185H240" stroke="#786788" />
      </g>}
      {kind === "care" && <g transform="translate(145 27) rotate(6 75 115)">
        <path d="M0 0H150V222L140 230L130 222L120 230L110 222L100 230L90 222L80 230L70 222L60 230L50 222L40 230L30 222L20 230L10 222L0 230Z" fill="#e8e3db" />
        <path d="M8 8H142" stroke="#a09a99" strokeDasharray="3 3" />
        <text x="75" y="47" textAnchor="middle" fill="#292531" fontFamily="Georgia,serif" fontSize="18" letterSpacing="2">MULANG</text>
        <text x="75" y="76" textAnchor="middle" fill="#5f5863" fontFamily="sans-serif" fontSize="10" letterSpacing="2">SIZE / FABRIC / CARE</text>
        <path d="M28 104H122M28 116H115M28 128H122M28 140H98" stroke="#aaa1ac" strokeWidth="3" />
        <rect x="31" y="160" width="23" height="22" rx="3" fill="none" stroke="#786d80" />
        <circle cx="75" cy="171" r="11" fill="none" stroke="#786d80" />
        <path d="M98 182L110 160L122 182Z" fill="none" stroke="#786d80" />
        <text x="75" y="207" textAnchor="middle" fill="#786d80" fontFamily="sans-serif" fontSize="8" letterSpacing="1">LAYOUT EXAMPLE</text>
      </g>}
      {kind === "tag" && <g>
        <path d="M222 10C325 2 350 57 293 76C265 85 218 44 222 10" fill="none" stroke="#a193b6" strokeWidth="2" />
        <g transform="translate(132 40) rotate(-9 90 108)">
          <rect x="9" y="8" width="180" height="216" rx="3" fill="#000" opacity=".25" />
          <rect width="180" height="216" rx="3" fill="#bdb0d6" />
          <circle cx="90" cy="19" r="4" fill="#342a42" />
          <text x="90" y="109" textAnchor="middle" fill="#292230" fontFamily="Georgia,serif" fontSize="26" letterSpacing="3">MULANG</text>
          <text x="90" y="132" textAnchor="middle" fill="#51445d" fontFamily="sans-serif" fontSize="9" letterSpacing="4">APPAREL</text>
          <path d="M64 168H116" stroke="#746386" />
        </g>
      </g>}
      {kind === "patch" && <g transform="translate(98 76) rotate(5 122 64)">
        <rect x="7" y="9" width="244" height="128" rx="20" fill="#000" opacity=".3" />
        <rect width="244" height="128" rx="20" fill="#42344f" />
        <rect x="9" y="9" width="226" height="110" rx="14" fill="none" stroke="#8a6b9f" strokeWidth="2" strokeDasharray="3 4" />
        <text x="122" y="70" textAnchor="middle" fill="#d8c7ed" fontFamily="Georgia,serif" fontSize="32" letterSpacing="3">MULANG</text>
        <text x="122" y="92" textAnchor="middle" fill="#b6a0c9" fontFamily="sans-serif" fontSize="10" letterSpacing="4">APPAREL</text>
      </g>}
      {kind === "bag" && <g transform="translate(99 27) rotate(-5 121 112)">
        <rect x="6" y="8" width="242" height="225" rx="12" fill="#000" opacity=".25" />
        <rect width="242" height="225" rx="12" fill="#d9d4e2" fillOpacity=".24" stroke="#d9d4e2" strokeOpacity=".5" />
        <path d="M9 20H233M9 26H233" stroke="#eee8fa" strokeOpacity=".6" />
        <rect x="27" y="44" width="188" height="160" rx="10" fill="#747080" fillOpacity=".5" />
        <text x="121" y="124" textAnchor="middle" fill="#e5dcf4" fontFamily="Georgia,serif" fontSize="28" letterSpacing="4">MULANG</text>
        <text x="121" y="147" textAnchor="middle" fill="#d3c9e0" fontFamily="sans-serif" fontSize="10" letterSpacing="5">APPAREL</text>
        <path d="M17 211H225" stroke="#d9d4e2" strokeOpacity=".3" />
      </g>}
      {kind === "tissue" && <g transform="translate(57 39) rotate(-6 163 99)">
        <path d="M8 8L311 0L329 190L19 205Z" fill="#d8d2df" />
        <path d="M8 8L163 112L311 0M19 205L163 112L329 190" fill="none" stroke="#afa7bb" strokeWidth="2" />
        {[50, 115, 180, 245].map((x) => <g key={x} fill="#9f93b0" fontFamily="sans-serif" fontSize="8" letterSpacing="2" transform={`translate(${x} 40) rotate(15)`}><text>MULANG</text><text y="49">MULANG</text><text y="98">MULANG</text></g>)}
        <circle cx="163" cy="112" r="28" fill="#544165" />
        <text x="163" y="118" textAnchor="middle" fill="#e3d8ef" fontFamily="Georgia,serif" fontSize="22">M</text>
      </g>}
      {kind === "box" && <g>
        <path d="M70 109L206 53L369 103L234 164Z" fill="#756386" />
        <path d="M70 109V193L234 251V164Z" fill="#3d304b" />
        <path d="M234 164L369 103V187L234 251Z" fill="#51405e" />
        <path d="M70 109L206 53L369 103L234 164Z" fill="none" stroke="#b8a1cc" strokeOpacity=".6" />
        <path d="M70 122L234 177L369 116" fill="none" stroke="#9e82b3" strokeOpacity=".55" />
        <text x="215" y="115" textAnchor="middle" fill="#e8dcf2" fontFamily="Georgia,serif" fontSize="25" letterSpacing="3" transform="rotate(-1 215 115)">MULANG</text>
        <text x="215" y="132" textAnchor="middle" fill="#d1bddf" fontFamily="sans-serif" fontSize="8" letterSpacing="4">APPAREL</text>
      </g>}
    </svg>
  );
}

export function BrandHeroArtwork() {
  return (
    <figure className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#14111c] p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between gap-4 text-sm text-zinc-400">
        <span className="uppercase tracking-widest">Your Brand, Every Detail</span>
        <span className="rounded-full border border-violet-300/30 px-3 py-1 text-violet-200">M / A</span>
      </div>
      <svg role="img" aria-label="Illustrative Mulang brand kit showing a woven label, hang tag, tissue wrap and garment box" viewBox="0 0 500 430" className="h-auto w-full">
        <defs>
          <linearGradient id="brand-kit-box" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#766087" /><stop offset="1" stopColor="#493551" /></linearGradient>
          <pattern id="brand-kit-grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#d3c4e8" strokeOpacity=".06" /></pattern>
        </defs>
        <rect width="500" height="430" fill="url(#brand-kit-grid)" />
        <ellipse cx="266" cy="350" rx="190" ry="40" fill="#000" opacity=".25" />
        <g transform="translate(86 127) rotate(-10 164 94)">
          <rect x="5" y="13" width="329" height="188" rx="5" fill="#251b2c" />
          <rect width="329" height="188" rx="5" fill="url(#brand-kit-box)" stroke="#baa0cb" strokeOpacity=".5" />
          <rect x="14" y="14" width="301" height="160" rx="2" fill="none" stroke="#d8bddf" strokeOpacity=".25" />
          <text x="165" y="94" textAnchor="middle" fontFamily="Georgia,serif" fontSize="37" fill="#efe5f4" letterSpacing="7">MULANG</text>
          <text x="165" y="120" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#d1b9dd" letterSpacing="8">APPAREL</text>
        </g>
        <g transform="translate(302 48) rotate(12 62 94)">
          <path d="M63 -30C133 -41 166 -5 125 24C102 42 53 -4 63 -30" fill="none" stroke="#ae9abd" strokeWidth="2" />
          <rect x="5" y="7" width="124" height="184" rx="3" fill="#000" opacity=".2" />
          <rect width="124" height="184" rx="3" fill="#d5c7e5" />
          <circle cx="62" cy="14" r="3.5" fill="#53405c" />
          <text x="62" y="91" textAnchor="middle" fontFamily="Georgia,serif" fontSize="19" fill="#332738" letterSpacing="1">MULANG</text>
          <text x="62" y="111" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill="#745c82" letterSpacing="3">APPAREL</text>
          <path d="M44 147H80" stroke="#9d85ad" />
        </g>
        <g transform="translate(42 292) rotate(-4 102 44)">
          <rect x="4" y="5" width="204" height="88" rx="3" fill="#000" opacity=".2" />
          <rect width="204" height="88" rx="3" fill="#e0d8cf" />
          <rect x="7" y="7" width="190" height="74" fill="none" stroke="#7c6b80" strokeDasharray="3 3" />
          <text x="102" y="43" textAnchor="middle" fontFamily="Georgia,serif" fontSize="23" fill="#332b3a" letterSpacing="4">MULANG</text>
          <text x="102" y="62" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill="#706176" letterSpacing="4">APPAREL</text>
        </g>
        <g transform="translate(298 285) rotate(9 72 42)">
          <path d="M0 0H147V90H0Z" fill="#b5a3c3" />
          <path d="M0 0L73 49L147 0M0 90L73 49L147 90" fill="none" stroke="#8c759e" />
          <circle cx="73" cy="49" r="20" fill="#4c365c" />
          <text x="73" y="55" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fill="#e5d8f0">M</text>
        </g>
      </svg>
      <figcaption className="mt-3 border-t border-white/10 pt-4 text-sm leading-relaxed text-zinc-400">Illustrative brand mockups. Materials, construction and artwork are confirmed for your order.</figcaption>
    </figure>
  );
}
