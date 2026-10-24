import type { Where } from "payload";

export function publishedPostWhere(now = new Date()): Where {
  return {
    and: [
      { _status: { equals: "published" } },
      { publishedAt: { less_than_equal: now.toISOString() } },
    ],
  };
}

export function publishedProductWhere(now = new Date()): Where {
  return {
    and: [
      { _status: { equals: "published" } },
      { publishedAt: { less_than_equal: now.toISOString() } },
    ],
  };
}

type Publication = { _status?: "draft" | "published" | null; publishedAt?: string | null };

export function withPublicationDate<T extends Publication>(
  data: T,
  original?: Publication,
  now = new Date(),
): T & Publication {
  const status = data._status ?? original?._status;
  const publishedAt = data.publishedAt ?? original?.publishedAt;
  return status === "published" && !publishedAt
    ? { ...data, publishedAt: now.toISOString() }
    : data;
}
