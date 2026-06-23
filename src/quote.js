import './style.css'
import { initializeQuoteBuilder } from './quote-builder.js'
import { initializeSite } from './site.js'

initializeSite(document.body.dataset.page ?? 'quote')
initializeQuoteBuilder()
