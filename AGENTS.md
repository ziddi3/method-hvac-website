# AGENTS.md

Read the authoritative canon before architectural work:

- `ziddi3/methodz-nexus-canon/NEXUS_ONTOLOGY.md`
- `ziddi3/methodz-nexus-canon/IMPLEMENTATION_MAP.md`
- `ziddi3/methodz-nexus-canon/CANON_CLARIFICATIONS_AND_CONTINUATION.md`

## Classification

This repository is the Method HVAC business container and storefront destination associated with Method Hub.

It is not Method Hub, Nexus Hub, the Cathedral, a Cathedral wing, or a Bob tool.

## Deployment boundary

- Primary destination: `method-hvac.ca`
- Forbidden destination: `hub.methodz.ca`

This repository must never replace, merge into, or deploy over Method Hub.

Its frontend is what users see behind the Method HVAC storefront door or when visiting its direct URL.

Before deployment, verify repository identity, brand markers, target domain, and absence of Method Hub deployment configuration.

Do not push unless explicitly authorized.
