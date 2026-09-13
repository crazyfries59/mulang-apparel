export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  cat: string;
  read: string;
  date: string;
  img: string;
  featured: boolean;
  /** Only published posts get a real /blog/[slug] page; others show as "Coming Soon". */
  published: boolean;
};

export const POSTS: Post[] = [
  {
    slug: "china-clothing-manufacturer-tips",
    title: "10 Things To Know Before Working With A Chinese Clothing Manufacturer",
    excerpt: "Red flags to avoid, questions to ask, and best practices for establishing a reliable, long-term relationship with your manufacturing partner.",
    cat: "Manufacturing",
    read: "9 min read",
    date: "Sep 14, 2026",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    featured: true,
    published: true,
  },
  {
    slug: "how-to-start-streetwear-brand",
    title: "How To Start A Streetwear Brand From Scratch in 2025",
    excerpt: "A complete guide covering everything from brand identity and design to finding the right manufacturer and launching your first drop.",
    cat: "Brand Startup",
    read: "8 min read",
    date: "Dec 15, 2024",
    img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
    featured: false,
    published: false,
  },
  {
    slug: "oem-vs-odm-clothing",
    title: "OEM vs ODM Clothing Manufacturing: Which Is Right For Your Brand?",
    excerpt: "Understanding the difference between OEM and ODM services will save you time, money, and headaches when sourcing your first collection.",
    cat: "OEM & ODM",
    read: "6 min read",
    date: "Dec 8, 2024",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    featured: false,
    published: false,
  },
  {
    slug: "minimum-order-quantity-guide",
    title: "MOQ Explained: What Minimum Order Quantities Mean For Your Brand",
    excerpt: "Breaking down MOQ requirements, negotiation strategies, and how to start small without compromising on quality or profit margins.",
    cat: "Manufacturing",
    read: "5 min read",
    date: "Nov 28, 2024",
    img: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80",
    featured: false,
    published: false,
  },
  {
    slug: "fabric-guide-streetwear",
    title: "The Ultimate Fabric Guide For Streetwear Brands: GSM, Composition & More",
    excerpt: "From 220GSM tees to 450GSM hoodies—everything you need to know about fabric weight, composition, and finishing for premium streetwear.",
    cat: "Custom Apparel",
    read: "10 min read",
    date: "Nov 20, 2024",
    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
    featured: false,
    published: false,
  },
  {
    slug: "private-label-clothing-guide",
    title: "Private Label Clothing: How To Build Your Brand Identity Through Manufacturing",
    excerpt: "Labels, hang tags, packaging, and brand storytelling—how to use private label services to create a cohesive, premium brand experience.",
    cat: "Brand Startup",
    read: "7 min read",
    date: "Nov 10, 2024",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    featured: false,
    published: false,
  },
];
