import Section from '../ui/Section.jsx';
import Icon from '../ui/Icon.jsx';
import ContactForm from './ContactForm.jsx';
import { SITE } from '../../config/site.js';

export default function ContactSection({ variant = 'muted', compact = false }) {
  return (
    <Section
      id="contact"
      variant={variant}
      eyebrow="Get in touch"
      title="Talk to a real Method technician."
      subtitle="Prefer to skip the form? Call or email — we answer Mon–Sat and dispatch emergencies 24/7."
    >
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-info__row">
            <span className="contact-info__row-icon">
              <Icon name="phone" size={18} />
            </span>
            <div className="contact-info__row-text">
              <strong>Call us</strong>
              <a href={SITE.phoneHref}>{SITE.phone}</a>
              <span> · 24/7 emergencies: </span>
              <a href={SITE.emergencyHref}>{SITE.emergencyPhone}</a>
            </div>
          </div>
          <div className="contact-info__row">
            <span className="contact-info__row-icon">
              <Icon name="mail" size={18} />
            </span>
            <div className="contact-info__row-text">
              <strong>Email</strong>
              <a href={SITE.emailHref}>{SITE.email}</a>
            </div>
          </div>
          <div className="contact-info__row">
            <span className="contact-info__row-icon">
              <Icon name="map" size={18} />
            </span>
            <div className="contact-info__row-text">
              <strong>Visit</strong>
              <span>
                {SITE.address.street}<br />
                {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
              </span>
            </div>
          </div>
          <div className="contact-info__row">
            <span className="contact-info__row-icon">
              <Icon name="clock" size={18} />
            </span>
            <div className="contact-info__row-text">
              <strong>Hours</strong>
              {SITE.hours.map((h) => (
                <span key={h.day} style={{ display: 'block' }}>
                  {h.day}: {h.hours}
                </span>
              ))}
            </div>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
              Service area
            </strong>
            <div className="area-chips">
              {SITE.serviceArea.map((city) => (
                <span key={city} className="area-chip">{city}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Send a message</h3>
          <p className="muted" style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--fs-sm)' }}>
            We typically reply within one business day.
          </p>
          <ContactForm compact={compact} />
        </div>
      </div>
    </Section>
  );
}
