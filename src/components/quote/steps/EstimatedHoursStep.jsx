import { RadioCard } from '../../ui/Form.jsx';
import { SERVICE_PRICING } from '../../../lib/pricing.js';
import { formatCurrency } from '../../../lib/format.js';

const REPAIR_OPTIONS = [
  {
    value: 1,
    title: 'Quick fix (~1 hr)',
    description: 'Igniter, capacitor, contactor, filter swap, simple diagnostics.',
  },
  {
    value: 2,
    title: 'Standard repair (~2 hr)',
    description: 'Blower motor, control board, condensate pump, refrigerant top-up.',
  },
  {
    value: 3,
    title: 'Complex repair (~3 hr)',
    description: 'Heat exchanger inspection, evaporator coil swap, refrigerant leak hunt.',
  },
  {
    value: 4,
    title: 'Major repair (4 hr +)',
    description: 'Compressor swap, full refrigerant recovery + recharge.',
  },
];

export default function EstimatedHoursStep({ state, setField }) {
  return (
    <>
      <div className="quote-choices quote-choices--2">
        {REPAIR_OPTIONS.map((opt) => (
          <RadioCard
            key={opt.value}
            name="estimatedHours"
            value={opt.value}
            checked={state.estimatedHours === opt.value}
            onChange={(value) => setField('estimatedHours', Number(value))}
            title={opt.title}
            description={opt.description}
          >
            <div className="quote-choice-meta">
              <span>{opt.value} hr × <strong>{formatCurrency(SERVICE_PRICING.hourlyRate)}</strong></span>
            </div>
          </RadioCard>
        ))}
      </div>
      <p className="muted" style={{ marginTop: 'var(--space-5)', fontSize: 'var(--fs-sm)' }}>
        A flat <strong>{formatCurrency(SERVICE_PRICING.diagnosticFee)} diagnostic fee</strong> applies
        to every service visit. Your technician will give you a fixed-price repair quote on-site —
        if you go ahead, the diagnostic is waived.
      </p>
    </>
  );
}
