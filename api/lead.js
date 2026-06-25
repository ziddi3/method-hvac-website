export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.METHODZ_CRM_WEBHOOK_SECRET

  if (!secret) {
    return res.status(500).json({ error: 'CRM webhook secret is not configured' })
  }

  try {
    const response = await fetch('https://crm.methodz.ca/api/webhooks/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-methodz-crm-secret': secret,
      },
      body: JSON.stringify(req.body),
    })

    const text = await response.text()

    if (!response.ok) {
      return res.status(response.status).send(text)
    }

    return res.status(202).send(text)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to forward lead to CRM' })
  }
}
