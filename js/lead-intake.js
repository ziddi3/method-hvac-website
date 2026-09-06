async function submitMethodzLead(e, brandDefault = "method_hvac") {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector("button[type=submit]");
  const originalText = btn ? btn.innerText : "Submit";
  if (btn) {
    btn.disabled = true;
    btn.innerText = "Submitting...";
  }

  const value = (selector) => form.querySelector(selector)?.value?.trim() || "";
  const name = value("[name=name]") || value("#name") || value("[name=company]");
  const email = value("[name=email]") || value("#email");
  const phone = value("[name=phone]") || value("#phone");
  const postalCode = value("[name=postal_code]") || value("[name=postalCode]") || value("#postalCode");
  const notes = value("[name=message]") || value("[name=notes]") || value("#message");
  const serviceType = value("[name=service_type]") || value("[name=service]") || "General HVAC";

  const payload = {
    brand: brandDefault,
    source: window.location.hostname || "method-hvac-website",
    serviceType,
    pageUrl: window.location.href,
    contact: {
      name,
      email,
      phone,
      postalCode,
      notes,
    },
  };

  try {
    // CRM credentials stay server-side in /api/lead. Browser bundles never
    // receive METHODZ_CRM_WEBHOOK_SECRET.
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Inquiry received. Our dispatch desk will reach out shortly.");
      form.reset();
    } else {
      alert("Submission failed. Please reach out to dispatch directly.");
    }
  } catch {
    alert("Connection error while submitting your request.");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = originalText;
    }
  }
}
window.submitMethodzLead = submitMethodzLead;