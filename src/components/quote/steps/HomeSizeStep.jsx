import { RadioCard } from '../../ui/Form.jsx';
import { HOME_SIZES } from '../../../data/homeSizes.js';

/**
 * Step 2 (install) — pick approximate home size. This determines base labor hours
 * and which catalog units are recommended.
 */
export default function HomeSizeStep({ state, setField }) {
  return (
    <div className="quote-choices quote-choices--2">
      {HOME_SIZES.map((h) => (
        <RadioCard
          key={h.id}
          name="homeSizeId"
          value={h.id}
          checked={state.homeSizeId === h.id}
          onChange={(value) => setField('homeSizeId', value)}
          title={h.label}
          description={h.description}
        >
          <div className="quote-choice-meta">
            <span>Recommended <strong>{h.recommendedTons} ton</strong> AC</span>
            <span>·</span>
            <span><strong>{h.recommendedBtu.toLocaleString()} BTU</strong> furnace</span>
            <span>·</span>
            <span>~<strong>{h.baseLaborHours} hr</strong> install</span>
          </div>
        </RadioCard>
      ))}
    </div>
  );
}
