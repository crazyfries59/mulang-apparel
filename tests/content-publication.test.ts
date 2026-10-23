import assert from "node:assert/strict";
import test from "node:test";
import { withPublicationDate, publishedPostWhere } from "../lib/content/publication.ts";

const now = new Date("2026-10-22T12:00:00.000Z");

test("first publication receives a date while a draft stays undated", () => {
  assert.equal(withPublicationDate({ _status: "published" }, undefined, now).publishedAt, now.toISOString());
  assert.equal(withPublicationDate({ _status: "draft" }, undefined, now).publishedAt, undefined);
});

test("editing an existing publication preserves its date and future scheduling", () => {
  const original = { _status: "published" as const, publishedAt: "2026-10-01T00:00:00.000Z" };
  assert.deepEqual(withPublicationDate({}, original, now), {});
  const scheduled = { _status: "published" as const, publishedAt: "2027-01-01T00:00:00.000Z" };
  assert.deepEqual(withPublicationDate(scheduled, undefined, now), scheduled);
});

test("the public filter requires both publication and a date that has arrived", () => {
  assert.deepEqual(publishedPostWhere(now), {
    and: [
      { _status: { equals: "published" } },
      { publishedAt: { less_than_equal: now.toISOString() } },
    ],
  });
});
