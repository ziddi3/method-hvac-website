import './style.css'
import './hardening.css'
import './crm-workflow.css'
import './mobile-quote-polish.css'
import { initializeSite } from './site.js'

initializeSite(document.body.dataset.page ?? 'home')

const contactForm = document.querySelector('[data-contact-form]')

if (contactForm) {
  contactForm.method = 'post'
}
