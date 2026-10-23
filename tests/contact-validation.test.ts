import assert from "node:assert/strict";
import test from "node:test";
import { CONTACT_LIMITS, parseContactData } from "../lib/contact-validation.ts";

const valid = { name: " Test Brand ", email: "buyer@example.com", message: "Please review my product brief." };

test("normalizes a complete inquiry and tolerates omitted optional fields", () => {
  const parsed = parseContactData(valid);
  assert.equal(parsed?.name, "Test Brand");
  assert.equal(parsed?.company, "");
  assert.equal(parsed?.message, valid.message);
});

test("malformed JSON field types return a validation error instead of throwing", () => {
  for (const input of [null, [], { ...valid, name: 42 }, { ...valid, message: {} }, { ...valid, company: ["x"] }]) {
    assert.equal(parseContactData(input), null);
  }
});

test("rejects missing details, malformed email and oversized optional fields", () => {
  for (const input of [
    { ...valid, message: "  " }, { ...valid, email: "not-an-email" },
    { ...valid, whatsapp: "x".repeat(CONTACT_LIMITS.whatsapp + 1) },
    { ...valid, message: "x".repeat(CONTACT_LIMITS.message + 1) },
  ]) assert.equal(parseContactData(input), null);
});
