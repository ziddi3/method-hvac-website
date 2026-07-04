# Method HVAC CRM workflow

This document defines the operating loop for Method HVAC lead capture, CRM routing, customer follow-up, and daily repository improvement.

## Lead capture fields

The quote builder collects and forwards these customer fields:

| Group | Fields | Purpose |
| --- | --- | --- |
| Contact | name, email, phone, postal code, address/community | Allows the coordinator to reach the customer and understand service area context. |
| Preference | preferred contact method, urgency, timeline | Sets the correct first-contact channel and response expectation. |
| Quote | service, package tier, home size, estimate ranges, GST | Keeps the customer's quote context attached to the CRM opportunity. |
| Notes | equipment details, error codes, scheduling notes | Reduces the amount of repeated discovery on the first call. |

## CRM payload contract

The browser creates a `leadPayload` object and the `/api/lead` endpoint enriches it before forwarding it to the CRM webhook.

Core CRM fields:

- `pipeline`: `Method HVAC Home Comfort Pipeline`
- `stage`: `new_quote_request`
- `leadStatus`: `new` in the browser payload and `accepted_by_website` after the API accepts it
- `priority`: `urgent`, `high`, `standard`, or `nurture`
- `score`: numeric 0-100 lead score
- `sla`: first-response target
- `nextActions`: coordinator checklist
- `tags`: GoHighLevel-ready lead tags
- `customFields`: service, package tier, home size, preferred contact, urgency, estimated low, estimated high

## Daily repository improvement loop

The `.github/workflows/daily-crm-improvement.yml` workflow opens one improvement issue per day. Each issue should produce one CRM, workflow, appearance, test, or documentation improvement.

## Required environment variable

`METHODZ_CRM_WEBHOOK_SECRET` must be configured in the deployment environment. It is never exposed to the browser.
