function ensureMemberCodeField() {
  const form = document.querySelector('[data-quote-form]')
  if (!form || form.querySelector('[name="memberCode"]')) return

  const notes = form.querySelector('[name="notes"]')
  const host = notes?.closest('label')?.parentElement || form.querySelector('.form-grid') || form
  const label = document.createElement('label')
  label.innerHTML = 'Methodz member code<input type="text" name="memberCode" placeholder="METHODZ10-XXXXXX" autocomplete="off" />'
  const status = document.createElement('p')
  status.className = 'detail-copy'
  status.setAttribute('data-member-rate-status', '')
  status.textContent = 'No Methodz member rate on this quote yet.'
  host.append(label, status)
}

ensureMemberCodeField()
