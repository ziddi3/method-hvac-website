import Section from '../ui/Section.jsx';
import Icon from '../ui/Icon.jsx';
import Button from '../ui/Button.jsx';

const PERKS = [
  {
    title: 'Approval in minutes',
    body: 'Pre-qualify in under 60 seconds. Soft credit check — no impact on your score.',
  },
  {
    title: 'Pay over 5 or 10 years',
    body: 'Flexible terms tailored to your monthly budget. Pay off early with no penalty.',
  },
  {
    title: 'No money down',
    body: '$0 deposit on approved credit. We invoice the lender, not you.',
  },
  {
    title: 'Use any rebate you qualify for',
    body: 'Stack ENERGY STAR and provincial rebates on top of financing for maximum savings.',
  },
];

export default function Financing() {
  return (
    <Section
      id="financing"
      variant="brand-soft"
      eyebrow="Financing"
      title="Pay it off over time — at rates that make sense."
      subtitle="Method partners with Financeit and SNAP Financial to offer fair financing on every install over $1,500."
    >
      <div className="fin-grid">
        <div className="fin-card">
          <div className="fin-card__rate">
            <span className="fin-card__rate-big">6.99%</span>
            <span className="fin-card__rate-small">APR · 60-month term · OAC</span>
          </div>
          <p className="muted" style={{ marginBottom: 'var(--space-5)' }}>
            Sample monthly payment on a $7,500 furnace + AC install:
          </p>
          <div className="fin-card__row">
            <span>Equipment & install (incl. GST)</span>
            <span>$7,500.00</span>
          </div>
          <div className="fin-card__row">
            <span>Down payment</span>
            <span>$0.00</span>
          </div>
          <div className="fin-card__row">
            <span>Term</span>
            <span>60 months</span>
          </div>
          <div className="fin-card__row">
            <span>Monthly payment</span>
            <span style={{ color: 'var(--color-brand-700)' }}>$148.46 / mo</span>
          </div>
          <p className="muted" style={{ marginTop: 'var(--space-5)', fontSize: 'var(--fs-xs)' }}>
            Illustrative only — actual rate and term subject to credit approval and lender terms.
            Method does not lend directly.
          </p>
        </div>

        <div>
          <ul className="fin-perks">
            {PERKS.map((p) => (
              <li key={p.title}>
                <Icon name="check" size={18} stroke={2.4} />
                <div>
                  <strong>{p.title}</strong>
                  <span className="muted" style={{ fontSize: 'var(--fs-sm)' }}>{p.body}</span>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <Button to="/quote" variant="primary">
              Build your quote first
              <Icon name="arrowRight" size={16} />
            </Button>
            <Button to="/contact" variant="ghost">
              Talk to financing
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
