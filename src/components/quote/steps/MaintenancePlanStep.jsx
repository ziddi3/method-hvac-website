import { RadioCard } from '../../ui/Form.jsx';
import Icon from '../../ui/Icon.jsx';
import Badge from '../../ui/Badge.jsx';
import { MAINTENANCE_PLANS } from '../../../lib/pricing.js';
import { formatCurrencyWhole } from '../../../lib/format.js';

export default function MaintenancePlanStep({ state, setField }) {
  return (
    <div className="quote-choices quote-choices--3">
      {MAINTENANCE_PLANS.map((p) => (
        <RadioCard
          key={p.id}
          name="maintenancePlanId"
          value={p.id}
          checked={state.maintenancePlanId === p.id}
          onChange={(value) => setField('maintenancePlanId', value)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
            <div className="radio-card__title">{p.name}</div>
            {p.badge && <Badge variant="default">{p.badge}</Badge>}
          </div>
          <div className="radio-card__sub" style={{ marginBottom: 'var(--space-3)' }}>
            <strong style={{ color: 'var(--color-brand-700)', fontSize: 'var(--fs-lg)' }}>
              {formatCurrencyWhole(p.price)}
            </strong>{' '}
            <span style={{ color: 'var(--color-ink-500)' }}>/ year</span>
          </div>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-ink-600)', margin: '0 0 var(--space-3)' }}>
            {p.description}
          </p>
          <ul className="svc-tile__bullets">
            {p.perks.map((perk) => (
              <li key={perk}>
                <Icon name="check" size={14} stroke={2.4} />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </RadioCard>
      ))}
    </div>
  );
}
