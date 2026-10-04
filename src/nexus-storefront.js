export const METHOD_HVAC_STOREFRONT = Object.freeze({
  protocol: "methodz.nexus-dock.v2",
  id: "method-hvac",
  host: "method-hub",
  role: "storefront",
  repository: "ziddi3/method-hvac-website",
  parentDockId: "method-hub",
  public: true,
  destination: Object.freeze({
    canonicalUrl: "https://method-hvac.ca",
    returnToHub: "https://hub.methodz.ca",
  }),
  sovereignty: Object.freeze({
    runtimeOwner: "method-hvac",
    stateOwner: "method-hvac",
    hubOwnsRuntime: false,
    hubOwnsBusinessState: false,
    survivesHubOffline: true,
  }),
  provides: Object.freeze([
    "method-hvac.customer-site",
    "method-hvac.quote-entry",
    "method-hvac.lead-capture",
  ]),
  requests: Object.freeze([
    "method-hub.storefront-placement",
    "nexus.module-health",
  ]),
});

export function validateMethodHvacStorefront(manifest = METHOD_HVAC_STOREFRONT) {
  const errors = [];
  if (manifest.role !== "storefront") errors.push("Method HVAC must remain a storefront");
  if (manifest.parentDockId !== "method-hub") errors.push("Method HVAC storefront must dock to Method Hub");
  if (manifest.repository !== "ziddi3/method-hvac-website") errors.push("Method HVAC storefront must retain its sovereign repository");
  if (manifest.sovereignty?.hubOwnsRuntime) errors.push("Method Hub cannot own Method HVAC runtime");
  if (manifest.sovereignty?.hubOwnsBusinessState) errors.push("Method Hub cannot own Method HVAC business state");
  if (!manifest.sovereignty?.survivesHubOffline) errors.push("Method HVAC must survive Method Hub outage");
  return errors;
}
