import './style.css'
import './hardening.css'
import './crm-workflow.css'
import './mobile-quote-polish.css'
import { initializeQuoteBuilder } from './quote-builder.js'
import { initializeSite } from './site.js'

initializeSite(document.body.dataset.page ?? 'quote')
initializeQuoteBuilder()
