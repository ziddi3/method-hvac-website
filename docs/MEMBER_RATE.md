# Methodz member rate on Method HVAC

Method HVAC owns quotes and bookings. Hub only issues the member pass.

## Code handoff

Quote form field `memberCode`. Valid pattern: `METHODZ10-XXXXXX`.

Applies 10% to equipment, labour, and materials before GST.

## Auto-apply handoff

Hub links here as:

```text
https://method-hvac.ca/quote.html?member=METHODZ10-XXXXXX&mz_token=<signed>
```

The quote builder verifies with `https://hub.methodz.ca/api/methodz/verify` and applies the rate.

## Booking mailer

`POST /api/booking` forwards to `https://crm.methodz.ca/api/webhooks/booking` so Franco and Charles still get the desk mail. That path used to sit on Hub by mistake.
