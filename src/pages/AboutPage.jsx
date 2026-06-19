import Section from '../components/ui/Section.jsx';
import Card from '../components/ui/Card.jsx';
import Icon from '../components/ui/Icon.jsx';
import Button from '../components/ui/Button.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import QuoteCTA from '../components/sections/QuoteCTA.jsx';
import { SITE, yearsInBusiness } from '../config/site.js';

import '../components/sections/Sections.css';

const VALUES = [
  {
    icon: 'badge',
    title: 'Transparent by default',
    body:
      'Every quote is itemized. Materials at MSRP, labour by the hour, GST shown — no markup ' +
      'magic. If you can do basic math, you can verify our work.',
  },
  {
    icon: 'shield',
    title: 'Technically rigorous',
    body:
      'Manual J load calcs, combustion analysis, refrigerant pressure logs — we document the ' +
      'numbers so the next tech (or the manufacturer warranty desk) has everything they need.',
  },
  {
    icon: 'leaf',
    title: 'Built for Alberta',
    body:
      'We design for –35 °C winters and 30 °C summers. Our installs sit through chinooks, ' +
      'cold snaps, and 25-year-old ductwork without missing a beat.',
  },
  {
    icon: 'spark',
    title: 'Respect the home',
    body:
      'Shoe covers, floor protection, and a clean mechanical room before we leave. ' +
      'Your home is not a job site.',
  },
];

const STATS = [
  { num: `${yearsInBusiness()}+`, label: 'Years in Alberta' },
  { num: '4,800+',                label: 'Homes installed' },
  { num: '4.9★',                  label: 'Google rating' },
  { num: '32',                    label: 'Ticketed technicians' },
];

export default function AboutPage() {
  return (
    <>
      <Section
        variant="brand"
        size="hero"
        eyebrow="About Method"
        title="Founded by Alberta techs who were tired of HVAC sales scripts."
        subtitle="Method HVAC was started in 2014 by a small crew of Master Gas Fitters who'd worked at three different big-name shops and got fed up with bait-and-switch quotes, hidden fees, and pushy commissions. We built Method to be the company we'd want to call ourselves."
      />

      <Section size="sm">
        <div className="about-stats">
          {STATS.map((s) => (
            <div key={s.label} className="about-stat">
              <span className="about-stat__num">{s.num}</span>
              <span className="about-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Our promise */}
      <Section
        variant="muted"
        eyebrow="Our promise"
        title="Trust, transparency, and the right work — every time."
        headerAlign="left"
      >
        <div className="about-promise">
          <div>
            <p style={{ fontSize: 'var(--fs-md)', color: 'var(--color-ink-700)' }}>
              Every Method install, repair, and tune-up follows the same internal checklist
              our techs use in the field. We publish the math on every quote, file the permits
              on every install, and stand behind the work in writing.
            </p>
            <p style={{ fontSize: 'var(--fs-md)', color: 'var(--color-ink-700)' }}>
              If we ever quote you something we don't end up doing, you don't pay for it.
              If we damage anything in your home, we fix or replace it — no insurance circus.
              If your system fails inside the workmanship window, we come back at no charge.
            </p>
            <p style={{ fontSize: 'var(--fs-md)', color: 'var(--color-ink-900)', fontWeight: 'var(--fw-semi)' }}>
              That's the Method.
            </p>
          </div>

          <div className="about-values">
            {VALUES.map((v) => (
              <Card key={v.title} padding="md" shadow accent="brand">
                <span className="card__icon">
                  <Icon name={v.icon} size={22} />
                </span>
                <h4 style={{ marginBottom: 'var(--space-1)' }}>{v.title}</h4>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-ink-600)' }}>{v.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Service area */}
      <Section
        eyebrow="Where we work"
        title="Proudly serving Alberta — Calgary to Edmonton and everywhere in between."
        subtitle="If you don't see your community below, call us anyway. We cover most of central and southern Alberta."
      >
        <div className="area-chips" style={{ justifyContent: 'center', gap: 'var(--space-3)' }}>
          {SITE.serviceArea.map((c) => (
            <span key={c} className="area-chip" style={{ fontSize: 'var(--fs-md)', padding: '0.55rem 1.15rem' }}>
              {c}
            </span>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <Button to="/quote" variant="primary" size="lg">
            Build a quote for your home
            <Icon name="arrowRight" size={16} />
          </Button>
        </div>
      </Section>

      <Testimonials limit={3} />
      <QuoteCTA />
    </>
  );
}
