import { Link } from 'react-router-dom';
import Section from '../components/ui/Section.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import QuoteCTA from '../components/sections/QuoteCTA.jsx';
import { SERVICES } from '../data/services.js';
import { PACKAGE_TIERS } from '../data/packages.js';
import { FAQS } from '../data/faqs.js';
import { formatCurrencyWhole } from '../lib/format.js';

import '../components/sections/Sections.css';

const ServiceBlock = ({ service, reverse }) => {
  const styles = {
    display: 'grid',
    gap: 'var(--space-8)',
    alignItems: 'center',
    gridTemplateColumns: '1fr',
  };
  return (
    <article id={service.id} style={{ scrollMarginTop: '120px', paddingBlock: 'var(--space-12)', borderTop: '1px solid var(--color-ink-200)' }}>
      <div style={{ ...styles }} className={`services-detail ${reverse ? 'reverse' : ''}`}>
        <div>
          <span className="text-eyebrow">
            {service.accent === 'heat' ? 'Heating · Repair' : 'Comfort · Air'}
          </span>
          <h2 style={{ marginTop: 'var(--space-2)' }}>{service.title}</h2>
          <p style={{ fontSize: 'var(--fs-md)', color: 'var(--color-ink-600)' }}>
            {service.long}
          </p>
          <ul className="svc-tile__bullets" style={{ marginBlock: 'var(--space-5)' }}>
            {service.bullets.map((b) => (
              <li key={b}><Icon name="check" size={14} stroke={2.4} /> <span>{b}</span></li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Button to={`/quote?service=${service.quoteType}`} variant="primary">
              Get a quote for this service
              <Icon name="arrowRight" size={16} />
            </Button>
            <Badge variant={service.accent === 'heat' ? 'heat' : 'default'}>
              From {formatCurrencyWhole(service.startingAt)}
            </Badge>
            <Badge variant="neutral">{service.durationDays}</Badge>
          </div>
        </div>

        <Card padding="lg" shadow accent={service.accent}>
          <div className={`card__icon${service.accent === 'heat' ? ' card__icon--heat' : ''}`}>
            <Icon name={service.icon} size={26} />
          </div>
          <h3>Why choose Method for {service.title.toLowerCase()}?</h3>
          <ul className="svc-tile__bullets">
            <li><Icon name="check" size={14} stroke={2.4} /><span>Ticketed Alberta-licensed technicians on every visit</span></li>
            <li><Icon name="check" size={14} stroke={2.4} /><span>Permits pulled, work inspected — your warranty stays valid</span></li>
            <li><Icon name="check" size={14} stroke={2.4} /><span>Transparent line-item pricing with GST shown up-front</span></li>
            <li><Icon name="check" size={14} stroke={2.4} /><span>Same-day service and after-hours emergency dispatch</span></li>
          </ul>
        </Card>
      </div>
    </article>
  );
};

export default function ServicesPage() {
  return (
    <>
      <Section
        variant="brand"
        size="hero"
        eyebrow="Services"
        title="Heating, cooling, and air quality — done the Method way."
        subtitle="Six pillars of Alberta home comfort, each backed by ticketed techs, transparent pricing, and our workmanship warranty."
      >
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button to="/quote" variant="inverse" size="lg">
            Build Your Quote
            <Icon name="arrowRight" size={16} />
          </Button>
          <Button to="/contact" variant="ghost" size="lg" style={{ color: 'white' }}>
            Speak to a tech
          </Button>
        </div>
      </Section>

      {/* Service-pillar quick-jump grid */}
      <Section size="sm" eyebrow="Jump to" title="What can we help with?">
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <Card key={s.id} interactive shadow accent={s.accent} as={Link} to={`#${s.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className={`card__icon${s.accent === 'heat' ? ' card__icon--heat' : ''}`}>
                <Icon name={s.icon} size={22} />
              </span>
              <h3 className="card__title">{s.title}</h3>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-ink-600)' }}>{s.short}</p>
              <div className="card__footer">
                <span style={{ color: 'var(--color-brand-700)', fontWeight: 'var(--fw-semi)', fontSize: 'var(--fs-sm)' }}>
                  Learn more →
                </span>
                <span style={{ fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-500)' }}>
                  from {formatCurrencyWhole(s.startingAt)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Detailed service sections */}
      <section>
        <div className="container">
          {SERVICES.map((s, i) => (
            <ServiceBlock key={s.id} service={s} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* Package tiers */}
      <Section
        variant="muted"
        eyebrow="Install tiers"
        title="Budget, Standard, or Premium — your call."
        subtitle="Every install package includes equipment, labour, permits, and full system commissioning. Pick the tier that fits your budget and comfort goals."
      >
        <div className="svc-grid">
          {PACKAGE_TIERS.map((t) => (
            <Card
              key={t.id}
              padding="lg"
              shadow
              accent={t.id === 'standard' ? 'brand' : undefined}
              selected={t.id === 'standard'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                <h3 style={{ marginBottom: 0 }}>{t.name}</h3>
                {t.badge && (
                  <Badge variant={t.id === 'premium' ? 'heat' : t.id === 'standard' ? 'default' : 'neutral'}>
                    {t.badge}
                  </Badge>
                )}
              </div>
              <p style={{ fontWeight: 'var(--fw-semi)', color: 'var(--color-ink-900)' }}>{t.headline}</p>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-ink-600)' }}>{t.summary}</p>
              <ul className="svc-tile__bullets">
                {t.perks.map((p) => (
                  <li key={p}><Icon name="check" size={14} stroke={2.4} /><span>{p}</span></li>
                ))}
              </ul>
              <div className="card__footer">
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-ink-500)' }}>
                  {t.workmanshipYears}-yr workmanship warranty
                </span>
                <Button to="/quote" variant={t.id === 'standard' ? 'primary' : 'secondary'} size="sm">
                  Pick {t.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <QuoteCTA />

      {/* FAQ */}
      <Section
        id="faq"
        variant="muted"
        eyebrow="FAQ"
        title="The questions every Alberta homeowner asks."
        subtitle="Don't see your question? Send it in — we'll answer same day."
      >
        <div className="faq-list">
          {FAQS.map((f) => (
            <details key={f.q} className="faq">
              <summary>{f.q}</summary>
              <div className="faq__body">{f.a}</div>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
