import './style.css'
import { initializeSite } from './site.js'

initializeSite(document.body.dataset.page ?? 'home')
