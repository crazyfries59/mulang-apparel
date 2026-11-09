"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Searchable country picker (same interaction as matcoremats.com/contact):
 * a button opens a listbox with a search field; rows show flag + name + dial
 * code; the search matches on name OR dial code. If nothing matches, the
 * buyer can still submit whatever they typed — nobody is ever blocked by a
 * missing entry.
 */

/* ISO 3166-1 alpha-2 -> dial code. Kept as one compact string to avoid a
   250-entry object literal bloating the bundle. */
const DIAL_CODES_RAW =
  "AD:376 AE:971 AF:93 AG:1268 AI:1264 AL:355 AM:374 AO:244 AR:54 AS:1684 AT:43 " +
  "AU:61 AW:297 AX:358 AZ:994 BA:387 BB:1246 BD:880 BE:32 BF:226 BG:359 BH:973 " +
  "BI:257 BJ:229 BL:590 BM:1441 BN:673 BO:591 BR:55 BS:1242 BT:975 BW:267 BY:375 " +
  "BZ:501 CA:1 CD:243 CF:236 CG:242 CH:41 CI:225 CK:682 CL:56 CM:237 CN:86 CO:57 " +
  "CR:506 CU:53 CV:238 CW:599 CY:357 CZ:420 DE:49 DJ:253 DK:45 DM:1767 DO:1809 " +
  "DZ:213 EC:593 EE:372 EG:20 EH:212 ER:291 ES:34 ET:251 FI:358 FJ:679 FK:500 " +
  "FM:691 FO:298 FR:33 GA:241 GB:44 GD:1473 GE:995 GF:594 GG:44 GH:233 GI:350 " +
  "GL:299 GM:220 GN:224 GP:590 GQ:240 GR:30 GT:502 GU:1671 GW:245 GY:592 HK:852 " +
  "HN:504 HR:385 HT:509 HU:36 ID:62 IE:353 IL:972 IM:44 IN:91 IQ:964 IR:98 " +
  "IS:354 IT:39 JE:44 JM:1876 JO:962 JP:81 KE:254 KG:996 KH:855 KI:686 KM:269 " +
  "KN:1869 KP:850 KR:82 KW:965 KY:1345 KZ:7 LA:856 LB:961 LC:1758 LI:423 LK:94 " +
  "LR:231 LS:266 LT:370 LU:352 LV:371 LY:218 MA:212 MC:377 MD:373 ME:382 MF:590 " +
  "MG:261 MH:692 MK:389 ML:223 MM:95 MN:976 MO:853 MP:1670 MQ:596 MR:222 MS:1664 " +
  "MT:356 MU:230 MV:960 MW:265 MX:52 MY:60 MZ:258 NA:264 NC:687 NE:227 NF:672 " +
  "NG:234 NI:505 NL:31 NO:47 NP:977 NR:674 NU:683 NZ:64 OM:968 PA:507 PE:51 " +
  "PF:689 PG:675 PH:63 PK:92 PL:48 PM:508 PR:1787 PS:970 PT:351 PW:680 PY:595 " +
  "QA:974 RE:262 RO:40 RS:381 RU:7 RW:250 SA:966 SB:677 SC:248 SD:249 SE:46 " +
  "SG:65 SH:290 SI:386 SK:421 SL:232 SM:378 SN:221 SO:252 SR:597 SS:211 ST:239 " +
  "SV:503 SX:1721 SY:963 SZ:268 TC:1649 TD:235 TG:228 TH:66 TJ:992 TL:670 TM:993 " +
  "TN:216 TO:676 TR:90 TT:1868 TW:886 TZ:255 UA:380 UG:256 US:1 UY:598 UZ:998 " +
  "VA:39 VC:1784 VE:584 VG:1284 VI:1340 VN:84 VU:678 WF:681 WS:685 XK:383 YE:967 " +
  "YT:262 ZA:27 ZM:260 ZW:263";

/* Markets that show up most in our inquiries — pinned to the top. */
const PRIORITY = [
  "US", "GB", "CA", "DE", "FR", "AU", "NL", "AE", "SA", "ES", "IT", "SE", "JP",
  "KR", "SG", "MY", "VN", "TH", "ID", "PH", "IN", "MX", "BR", "ZA", "NG", "TR",
];

/* Overrides so CN regions follow our naming convention. */
const NAME_OVERRIDES: Record<string, string> = {
  HK: "Hong Kong SAR, China",
  TW: "Taiwan, China",
  MO: "Macao SAR, China",
};

type Country = { code: string; name: string; flag: string; dial: string };

function flagOf(code: string) {
  return String.fromCodePoint(
    ...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

function buildCountries(): Country[] {
  const dial = new Map<string, string>();
  for (const pair of DIAL_CODES_RAW.split(" ")) {
    const [code, num] = pair.split(":");
    dial.set(code, num);
  }
  let names: Intl.DisplayNames;
  try {
    names = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    names = null as unknown as Intl.DisplayNames;
  }
  const all = [...dial.keys()].map((code) => {
    const name = NAME_OVERRIDES[code] ?? names?.of(code) ?? code;
    return { code, name, flag: flagOf(code), dial: "+" + dial.get(code) };
  });
  const priority: Country[] = PRIORITY.map((c) =>
    all.find((x) => x.code === c)!,
  ).filter(Boolean);
  const rest = all
    .filter((c) => !PRIORITY.includes(c.code))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...priority, ...rest];
}

/* Common aliases buyers actually type. */
const ALIASES: Record<string, string> = {
  usa: "United States", america: "United States", uk: "United Kingdom",
  britain: "United Kingdom", england: "United Kingdom", uae: "United Arab Emirates",
  holland: "Netherlands", korea: "South Korea",
};

function aliasFor(q: string): string | undefined {
  const key = q.replace(/[^a-z ]/g, "");
  return ALIASES[key];
}

export default function CountrySelect({
  id,
  value,
  onChange,
  onInvalid,
}: {
  id: string;
  value: string;
  onChange: (country: string) => void;
  onInvalid?: () => void;
}) {
  const countries = useMemo(() => buildCountries(), []);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0); // highlighted row index
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = countries.find((c) => c.name === value);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return countries;
    const aliased = aliasFor(q);
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.dial.replace("+", "").startsWith(q) ||
        (aliased !== undefined && c.name.toLowerCase() === aliased.toLowerCase()),
    );
  }, [query, countries]);

  /* Click-outside / Escape to close. */
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openList = () => {
    setOpen(true);
    setQuery("");
    setActive(0);
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  const pick = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return openList();
      setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open) {
        if (matches.length > 0) pick(matches[active]?.name ?? matches[0].name);
        else if (query.trim()) pick(query.trim().slice(0, 100));
      } else {
        openList();
      }
    } else if (e.key === "Tab" && open) {
      setOpen(false);
    }
  };

  const noMatch = query.trim().length > 0 && matches.length === 0;

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (!value.trim()) onInvalid?.();
        }}
        className="flex w-full items-center gap-2.5 bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-left text-white focus:outline-none focus:border-violet-500/50 transition-colors"
      >
        {selected ? (
          <>
            <span className="text-base leading-none">{selected.flag}</span>
            <span className="truncate">{selected.name}</span>
            <span className="ml-auto text-white/30 text-xs">{selected.dial}</span>
          </>
        ) : value ? (
          <span className="truncate">{value}</span>
        ) : (
          <span className="text-white/20">Select country</span>
        )}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""} ${selected || value ? "ml-2" : "ml-auto"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Country"
          className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-[#141414] shadow-2xl shadow-black/50 overflow-hidden"
        >
          <div className="p-2 border-b border-white/8">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search country or code…"
              className="w-full bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {matches.map((c, i) => (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={c.name === value}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(c.name)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors ${
                    i === active ? "bg-violet-500/15 text-white" : "text-white/70 hover:bg-white/5"
                  } ${c.name === value ? "text-violet-300" : ""}`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-white/25 text-xs">{c.dial}</span>
                </button>
              </li>
            ))}
            {noMatch && (
              <li>
                <button
                  type="button"
                  onClick={() => pick(query.trim().slice(0, 100))}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-left text-violet-300 hover:bg-white/5"
                >
                  <span className="text-white/25">+</span>
                  <span>
                    Use &ldquo;{query.trim()}&rdquo;
                  </span>
                </button>
              </li>
            )}
            {noMatch && (
              <li className="px-3 py-2 text-xs text-white/30">
                No matching country — your own entry is accepted as typed.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
