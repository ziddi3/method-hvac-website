import './style.css'
import './hardening.css'
import { initializeSite } from './site.js'

initializeSite(document.body.dataset.page ?? 'home')

const contactForm = document.querySelector('[data-contact-form]')

if (contactForm) {
  contactForm.method = 'post'
}
