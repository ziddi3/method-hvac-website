const navigationItems = [
  { key: 'home', href: '/index.html', label: 'Home' },
  { key: 'quote', href: '/quote.html', label: 'Build Your Quote' },
  { key: 'services', href: '/services.html', label: 'Services' },
  { key: 'about', href: '/about.html', label: 'About' },
  { key: 'contact', href: '/contact.html', label: 'Contact' },
]

const serviceAreas = 'Calgary, Airdrie, Chestermere, Cochrane, Okotoks, and nearby Alberta communities'

function renderNavigation(pageKey) {
  return navigationItems
    .map(
      ({ key, href, label }) => `
        <a class="site-nav-link${key === pageKey ? ' is-active' : ''}" href="${href}"${
          key === pageKey ? ' aria-current="page"' : ''
        }>${label}</a>
      `,
    )
    .join('')
}

export function initializeSite(pageKey) {
  const header = document.querySelector('[data-site-header]')
  const footer = document.querySelector('[data-site-footer]')

  if (header) {
    header.innerHTML = `
      <div class="container site-header-inner">
        <a class="brand-lockup" href="/index.html" aria-label="Method HVAC home">
          <span class="brand-name">Method HVAC</span>
          <span class="brand-tagline">It's all in the Method.</span>
        </a>
        <div class="site-header-links">
          <nav class="site-nav" aria-label="Primary">
            ${renderNavigation(pageKey)}
          </nav>
          <a class="hub-link" href="https://hub.methodz.ca">Return to Method Hub</a>
        </div>
      </div>
    `
  }

  if (footer) {
    footer.innerHTML = `
      <div class="container site-footer-inner">
        <div>
          <p class="brand-name">Method HVAC</p>
          <p class="footer-copy">Transparent heating and cooling quotes for Alberta homeowners.</p>
        </div>
        <div>
          <p class="footer-heading">Contact</p>
          <p><a class="text-link-inline" href="tel:13683374085">3683374085</a></p>
          <p><a class="text-link-inline" href="mailto:franco@method-hvac.ca">franco@method-hvac.ca</a></p>
          <p>${serviceAreas}</p>
        </div>
        <div>
          <p class="footer-heading">Explore</p>
          <div class="footer-links">${renderNavigation(pageKey)}</div>
        </div>
        <div>
          <p class="footer-heading">Method Hub</p>
          <a class="hub-link footer-hub-link" href="https://hub.methodz.ca">Return to Method Hub</a>
          <p class="footer-copy">Prepared for future GoHighLevel lead capture integration.</p>
        </div>
      </div>
      <div class="container site-footer-base">
        <p>© <span data-year></span> Method HVAC. Serving Alberta with a transparent process.</p>
      </div>
    `
  }

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear().toString()
  })

  initializeContactForms()
}

function initializeContactForms() {
  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    if (form.dataset.enhanced === 'true') {
      return
    }

    form.dataset.enhanced = 'true'
    const status = form.querySelector('[data-form-status]')

    form.addEventListener('submit', (event) => {
      event.preventDefault()

      if (!form.reportValidity()) {
        return
      }

      const details = new FormData(form)
      const firstName = details.get('name')?.toString().trim().split(' ')[0] ?? 'there'

      if (status) {
        status.textContent = `Thanks ${firstName} — your request is ready for our coordinator. While full GoHighLevel syncing is still being connected, you can also call 3683374085 for immediate scheduling.`
      }
    })
  })
}
