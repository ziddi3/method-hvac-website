import { RadioCard } from '../../ui/Form.jsx';
import Icon from '../../ui/Icon.jsx';
import Badge from '../../ui/Badge.jsx';
import { PACKAGE_TIERS } from '../../../data/packages.js';

/**
 * Step 3 (install) — Budget / Standard / Premium picker.
 * Choosing a tier auto-loads its default materials in the next step,
 * but the customer can still freely add / remove anything.
 */
export default function PackageTierStep({ state, setField }) {
  return (
    <div className="quote-choices quote-choices--3">
      {PACKAGE_TIERS.map((t) => (
        <RadioCard
          key={t.id}
          name="tierId"
          value={t.id}
          checked={state.tierId === t.id}
          onChange={(value) => setField('tierId', value)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <div className="radio-card__title">{t.name}</div>
            {t.badge && (
              <Badge variant={t.id === 'premium' ? 'heat' : t.id === 'standard' ? 'default' : 'neutral'}>
                {t.badge}
              </Badge>
            )}
          </div>
          <div className="radio-card__sub" style={{ marginBottom: 'var(--space-3)' }}>{t.headline}</div>
          <ul className="svc-tile__bullets" style={{ marginBottom: 'var(--space-3)' }}>
            {t.perks.map((p) => (
              <li key={p}>
                <Icon name="check" size={14} stroke={2.4} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="quote-choice-meta">
            <span><strong>{t.workmanshipYears}-yr</strong> workmanship warranty</span>
          </div>
        </RadioCard>
      ))}
    </div>
  );
}
