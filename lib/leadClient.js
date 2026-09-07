export async function submitLeadToCrm(formData) {
  const payload = {
    brand: formData.brand || "method_hvac",
    source: formData.source || (typeof window !== "undefined" ? window.location.hostname : "method-hvac-website"),
    serviceType: formData.service_type || formData.service || "General HVAC",
    pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    contact: {
      name: formData.name || formData.contact_name,
      email: formData.email || formData.contact_email,
      phone: formData.phone || formData.contact_phone,
      postalCode: formData.postal_code || formData.postalCode || "",
      notes: formData.notes || formData.message || "Website quote request",
    },
    estimate: {
      estimatedValueCad: Number(formData.estimated_value_cad || formData.estimatedValue || 0),
    },
  };

  // Browser/client code never receives a CRM credential. /api/lead is the
  // same-origin server-side boundary that owns METHODZ_CRM_WEBHOOK_SECRET.
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  return response.json();
}