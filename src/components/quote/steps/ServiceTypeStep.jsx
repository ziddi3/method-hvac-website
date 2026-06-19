import { RadioCard } from '../../ui/Form.jsx';
import { formatCurrencyWhole } from '../../../lib/format.js';

/**
 * Step 1 — pick the service the customer wants a quote for.
 * Pre-selectable via the `?service=` query string.
 */
const SERVICE_OPTIONS = [
  {
    value: 'ac-install',
    title: 'Install central air conditioning',
    description: 'Add or replace a central AC system. From $4,200 installed.',
    startingAt: 4200,
  },
  {
    value: 'furnace-install',
    title: 'Install or replace furnace',
    description: 'High-efficiency Goodman, Carrier, or Lennox — sized for –35 °C.',
    startingAt: 4600,
  },
  {
    value: 'repair',
    title: 'Service or repair',
    description: 'Heating or cooling acting up? Diagnostic + fix, transparent hourly rate.',
    startingAt: 89,
  },
  {
    value: 'maintenance',
    title: 'Annual maintenance plan',
    description: 'Tune-up, safety checks, priority dispatch, and parts discount.',
    startingAt: 199,
  },
];

export default function ServiceTypeStep({ state, setField }) {
  return (
    <div className="quote-choices quote-choices--2">
      {SERVICE_OPTIONS.map((opt) => (
        <RadioCard
          key={opt.value}
          name="quoteType"
          value={opt.value}
          checked={state.quoteType === opt.value}
          onChange={(value) => setField('quoteType', value)}
          title={opt.title}
          description={opt.description}
        >
          <div className="quote-choice-meta">
            <span>From <strong>{formatCurrencyWhole(opt.startingAt)}</strong></span>
          </div>
        </RadioCard>
      ))}
    </div>
  );
}
