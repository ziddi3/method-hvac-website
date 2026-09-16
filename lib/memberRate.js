const CODE_RE = /^METHODZ10-[A-Z0-9]{4,12}$/i
const VERIFY_URL = 'https://hub.methodz.ca/api/methodz/verify'

export function readMemberParams(search = typeof window !== 'undefined' ? window.location.search : '') {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
  return {
    code: (params.get('member') || params.get('code') || '').trim().toUpperCase(),
    token: (params.get('mz_token') || params.get('token') || '').trim(),
    email: (params.get('mz_email') || params.get('email') || '').trim().toLowerCase(),
  }
}

export function looksLikeMemberCode(code) {
  return CODE_RE.test(String(code || '').trim())
}

export async function verifyMemberPass({ code, token, email } = {}) {
  if (token || (code && looksLikeMemberCode(code))) {
    try {
      const url = new URL(VERIFY_URL)
      if (token) url.searchParams.set('token', token)
      if (code) url.searchParams.set('code', code)
      if (email) url.searchParams.set('email', email)
      const res = await fetch(url.toString())
      const data = await res.json().catch(() => ({}))
      if (data.valid) {
        return {
          applied: true,
          rate: Number(data.rate || 10) / 100,
          code: data.code || code,
          mode: data.mode || (token ? 'apply' : 'code'),
        }
      }
    } catch {
      // fall through to local code accept
    }
  }

  if (looksLikeMemberCode(code)) {
    return { applied: true, rate: 0.1, code, mode: 'code' }
  }

  return { applied: false, rate: 0, code: '', mode: null }
}

export function scaleRange(range, factor) {
  return {
    low: Math.round(range.low * factor),
    high: Math.round(range.high * factor),
  }
}
