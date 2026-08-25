export async function submitLeadToCrm(formData) {
  const CRM_INGEST_ENDPOINT = "https://leading.methodz.ca/api/webhooks/lead";
  const SECRET_KEY = "methodz-crm-2026-secret";

  const payload = {
    brand: formData.brand || "method_hvac",
    source: formData.source || (typeof window !== "undefined" ? window.location.hostname : "website"),
    service_type: formData.service_type || formData.service || "General HVAC",
    contact_name: formData.name || formData.contact_name,
    contact_email: formData.email || formData.contact_email,
    contact_phone: formData.phone || formData.contact_phone,
    postal_code: formData.postal_code || formData.postalCode || "AB",
    payload: {
      notes: formData.notes || formData.message || "Website quote request",
      estimated_value_cad: Number(formData.estimated_value_cad || formData.estimatedValue || 0)
    }
  };

  const response = await fetch(CRM_INGEST_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-methodz-crm-secret": SECRET_KEY
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  return response.json();
}
