import assert from "node:assert/strict";
import test from "node:test";
import { checkRateLimit, resetRateLimit } from "../src/lib/rate-limit";

const config = { windowMs: 60_000, max: 3, keyPrefix: "test" };

test("checkRateLimit allows first request", () => {
  resetRateLimit("ip1", "test");
  const result = checkRateLimit("ip1", config);
  assert.equal(result.allowed, true);
  assert.equal(result.retryAfterMs, 0);
});

test("checkRateLimit allows up to max requests", () => {
  resetRateLimit("ip2", "test");
  checkRateLimit("ip2", config);
  checkRateLimit("ip2", config);
  const third = checkRateLimit("ip2", config);
  assert.equal(third.allowed, true);
});

test("checkRateLimit blocks after max requests", () => {
  resetRateLimit("ip3", "test");
  checkRateLimit("ip3", config);
  checkRateLimit("ip3", config);
  checkRateLimit("ip3", config);
  const fourth = checkRateLimit("ip3", config);
  assert.equal(fourth.allowed, false);
  assert.ok(fourth.retryAfterMs > 0);
});

test("resetRateLimit clears the counter", () => {
  resetRateLimit("ip4", "test");
  checkRateLimit("ip4", config);
  checkRateLimit("ip4", config);
  checkRateLimit("ip4", config);
  const blocked = checkRateLimit("ip4", config);
  assert.equal(blocked.allowed, false);

  resetRateLimit("ip4", "test");
  const afterReset = checkRateLimit("ip4", config);
  assert.equal(afterReset.allowed, true);
});

test("different identifiers have independent limits", () => {
  resetRateLimit("ip5", "test");
  resetRateLimit("ip6", "test");

  checkRateLimit("ip5", config);
  checkRateLimit("ip5", config);
  checkRateLimit("ip5", config);
  const blocked = checkRateLimit("ip5", config);
  assert.equal(blocked.allowed, false);

  const other = checkRateLimit("ip6", config);
  assert.equal(other.allowed, true);
});

test("different prefixes are independent", () => {
  resetRateLimit("shared", "test");
  resetRateLimit("shared", "other");

  checkRateLimit("shared", { ...config, keyPrefix: "test" });
  checkRateLimit("shared", { ...config, keyPrefix: "test" });
  checkRateLimit("shared", { ...config, keyPrefix: "test" });
  const blocked = checkRateLimit("shared", { ...config, keyPrefix: "test" });
  assert.equal(blocked.allowed, false);

  const other = checkRateLimit("shared", { ...config, keyPrefix: "other" });
  assert.equal(other.allowed, true);
});
