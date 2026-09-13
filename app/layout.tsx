// Fonts: Playfair Display (serif headings) + Inter (body)
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const SITE_URL = "https://lin6666.top";
const OG_IMAGE = "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=85";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mulang Apparel — Premium Streetwear Manufacturer",
    template: "%s | Mulang Apparel",
  },
  description:
    "Premium streetwear and private label clothing manufacturer based in Guangzhou, China. OEM & ODM services for global fashion brands. Low MOQ, fast sampling, strict QC.",
  keywords: [
    "streetwear manufacturer",
    "private label clothing manufacturer",
    "custom apparel manufacturer",
    "OEM clothing manufacturer",
    "ODM clothing",
    "hoodie manufacturer",
    "custom t-shirt manufacturer",
    "Guangzhou clothing factory",
    "bulk clothing manufacturer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mulang Apparel — Premium Streetwear Manufacturer",
    description: "Custom Clothing Manufacturing For Global Fashion Brands",
    type: "website",
    locale: "en_US",
    siteName: "Mulang Apparel",
    url: SITE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Mulang Apparel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mulang Apparel — Premium Streetwear Manufacturer",
    description: "Custom Clothing Manufacturing For Global Fashion Brands",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mulang Apparel",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description:
      "Premium streetwear and private label clothing manufacturer based in Guangzhou, China.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Guangzhou",
      addressCountry: "CN",
    },
    sameAs: ["https://wa.me/8615986213212"],
  };

  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CustomCursor />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
