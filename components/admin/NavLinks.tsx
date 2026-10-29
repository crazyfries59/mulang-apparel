"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "概览" },
  { href: "/admin/crm-board", label: "CRM 销售看板" },
];

/* Extra entries above Payload's collection groups for the two custom pages. */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="mx-nav">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} className={`mx-nav__link${pathname === link.href ? " mx-nav__link--active" : ""}`}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
