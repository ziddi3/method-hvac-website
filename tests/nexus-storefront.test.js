import assert from "node:assert/strict";
import test from "node:test";
import { METHOD_HVAC_STOREFRONT, validateMethodHvacStorefront } from "../src/nexus-storefront.js";

test("Method HVAC docks to Method Hub while retaining sovereignty", () => {
  assert.deepEqual(validateMethodHvacStorefront(), []);
  assert.equal(METHOD_HVAC_STOREFRONT.role, "storefront");
  assert.equal(METHOD_HVAC_STOREFRONT.parentDockId, "method-hub");
  assert.equal(METHOD_HVAC_STOREFRONT.sovereignty.hubOwnsRuntime, false);
  assert.equal(METHOD_HVAC_STOREFRONT.sovereignty.survivesHubOffline, true);
});

test("storefront validation rejects absorption into Method Hub", () => {
  const invalid = {
    ...METHOD_HVAC_STOREFRONT,
    sovereignty: { ...METHOD_HVAC_STOREFRONT.sovereignty, hubOwnsRuntime: true },
  };
  assert.match(validateMethodHvacStorefront(invalid).join(" "), /cannot own Method HVAC runtime/);
});

test("storefront validation rejects Cathedral placement", () => {
  const invalid = { ...METHOD_HVAC_STOREFRONT, parentDockId: "cathedral" };
  assert.match(validateMethodHvacStorefront(invalid).join(" "), /dock to Method Hub/);
});
