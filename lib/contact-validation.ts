export const CONTACT_LIMITS = {
  name: 200, company: 200, email: 254, whatsapp: 80,
  productType: 100, quantity: 100, message: 5000,
} as const;

export type ContactData = Record<keyof typeof CONTACT_LIMITS, string>;

export function parseContactData(body: unknown): ContactData | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  const result = {} as ContactData;
  for (const key of Object.keys(CONTACT_LIMITS) as (keyof ContactData)[]) {
    const value = input[key] ?? "";
    if (typeof value !== "string" || value.length > CONTACT_LIMITS[key]) return null;
    result[key] = value.trim();
  }
  if (!result.name || !result.email || !result.message) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) return null;
  return result;
}
