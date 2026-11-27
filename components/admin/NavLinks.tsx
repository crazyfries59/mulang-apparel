"use client";

import { Columns3, LayoutGrid, MessageCircle } from "lucide-react";
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
      {/* 走签票接口，点开就是已经登录好的分流后台，业务员不用再输密码 */}
      <a href="/api/wa-sso" target="_blank" rel="noreferrer" className="mx-nav__link">
        <MessageCircle size={18} aria-hidden="true" />
        WhatsApp 客服
      </a>
    </div>
  );
}
