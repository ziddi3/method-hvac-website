import Section from '../components/ui/Section.jsx';
import Icon from '../components/ui/Icon.jsx';
import ContactSection from '../components/sections/ContactSection.jsx';
import { SITE } from '../config/site.js';

import '../components/sections/Sections.css';

export default function ContactPage() {
  return (
    <>
      <Section
        variant="brand"
        size="hero"
        eyebrow="Contact"
        title="Talk to a Method technician."
        subtitle="Phone, email, or the form below — whichever works for you. We typically reply within one business day, and dispatch emergencies 24/7."
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <a
            href={SITE.phoneHref}
            className="btn btn--inverse btn--lg"
          >
            <Icon name="phone" size={18} />
            Call {SITE.phone}
          </a>
          <a
            href={SITE.emergencyHref}
            className="btn btn--heat btn--lg"
          >
            <Icon name="clock" size={18} />
            24/7 Emergency: {SITE.emergencyPhone}
          </a>
        </div>
      </Section>

      <ContactSection variant="default" compact={false} />
    </>
  );
}
