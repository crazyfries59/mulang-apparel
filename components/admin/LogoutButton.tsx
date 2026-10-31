"use client";

import { useAuth } from "@payloadcms/ui";
import { LogOut } from "lucide-react";
import Link from "next/link";

/* Bottom of the sidebar: who is signed in, and a labelled sign-out link instead of a bare icon. */
export function LogoutButton() {
  const { user } = useAuth();
  return (
    <div className="mx-account">
      {user?.email && <span className="mx-account__email" title={user.email}>{user.email}</span>}
      <Link className="mx-account__logout" href="/admin/logout" prefetch={false}>
        <LogOut size={16} aria-hidden="true" />
        退出登录
      </Link>
    </div>
  );
}
