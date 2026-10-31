import Link from "next/link";

/* Mulang branding for the admin: the square "M" mark replaces Payload's logo in the header,
   on the login page and at the top of the sidebar. */

export function BrandIcon() {
  return <span className="mx-mark" aria-hidden="true">M</span>;
}

export function BrandLogo() {
  return (
    <div className="mx-brand mx-brand--login">
      <span className="mx-mark" aria-hidden="true">M</span>
      <span>
        <b>Mulang Apparel</b>
        <small>网站与销售后台</small>
      </span>
    </div>
  );
}

export function NavBrand() {
  return (
    <Link className="mx-brand" href="/admin">
      <span className="mx-mark" aria-hidden="true">M</span>
      <b>Mulang 后台</b>
    </Link>
  );
}
