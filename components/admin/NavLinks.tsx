"use client";

import { Columns3, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "概览", Icon: LayoutGrid },
  { href: "/admin/crm-board", label: "CRM 销售看板", Icon: Columns3 },
];

/* Extra entries above Payload's collection groups for the two custom pages. */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="mx-nav">
      {LINKS.map(({ href, label, Icon }) => (
        <Link key={href} href={href} className={`mx-nav__link${pathname === href ? " mx-nav__link--active" : ""}`}>
          <Icon size={18} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </div>
  );
}
