import { Link } from 'react-router-dom';
import { SITE, yearsInBusiness } from '../../config/site.js';
import Icon from '../ui/Icon.jsx';
import MethodHubLink from './MethodHubLink.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="header__logo-mark" style={{ width: 32, height: 32 }}>
                <Icon name="spark" size={18} stroke={2.2} />
              </span>
              Method HVAC
            </Link>
            <p style={{ color: 'var(--color-ink-300)' }}>
              Alberta-owned heating, cooling, and indoor air quality experts —
              fairly priced, transparently quoted, and installed right the first time
              for {yearsInBusiness()}+ years.
            </p>
            <MethodHubLink />
            <div className="footer__social" aria-label="Social media">
              <a href={SITE.social.facebook} aria-label="Facebook">
                <Icon name="facebook" size={16} />
              </a>
              <a href={SITE.social.instagram} aria-label="Instagram">
                <Icon name="instagram" size={16} />
              </a>
              <a href={SITE.social.google} aria-label="Google reviews">
                <Icon name="google" size={16} />
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services#ac-install">Air Conditioning</Link></li>
              <li><Link to="/services#furnace-install">Furnaces</Link></li>
              <li><Link to="/services#repair">Service &amp; Repair</Link></li>
              <li><Link to="/services#maintenance">Maintenance Plans</Link></li>
              <li><Link to="/services#thermostat">Thermostats</Link></li>
              <li><Link to="/services#iaq">Indoor Air Quality</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Method</Link></li>
              <li><Link to="/quote">Build Your Quote</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href={SITE.hubUrl}>Method Hub</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <ul className="footer__contact-list">
              <li>
                <a href={SITE.phoneHref}>
                  <Icon name="phone" size={14} /> {SITE.phone}
                </a>
              </li>
              <li>
                <a href={SITE.emergencyHref}>
                  <Icon name="clock" size={14} /> 24/7: {SITE.emergencyPhone}
                </a>
              </li>
              <li>
                <a href={SITE.emailHref}>
                  <Icon name="mail" size={14} /> {SITE.email}
                </a>
              </li>
              <li style={{ color: 'var(--color-ink-300)' }}>
                <Icon name="map" size={14} /> {SITE.address.street}, {SITE.address.city}, {SITE.address.region}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__legal">
          <span>© {new Date().getFullYear()} Method HVAC Ltd. All rights reserved.</span>
          <div className="footer__licenses">
            {SITE.licenses.map((l) => (
              <span key={l.label}>
                {l.label}{l.number ? ` — #${l.number}` : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
