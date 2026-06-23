import './style.css'
import './hardening.css'
import { initializeSite } from './site.js'

initializeSite(document.body.dataset.page ?? 'home')
