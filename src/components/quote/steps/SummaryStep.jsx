import { formatCurrency } from '../../../lib/format.js';
import { getHomeSize } from '../../../data/homeSizes.js';
import { getTier } from '../../../data/packages.js';

const QUOTE_TYPE_LABELS = {
  'ac-install': 'Central air-conditioning install',
  'furnace-install': 'Furnace install',
  'repair': 'Service & repair visit',
  'maintenance': 'Maintenance plan',
};

/**
 * Final review screen — last chance for the customer to verify line items
 * before the wizard fires submitQuoteToGHL.
 */
export default function SummaryStep({ state, quote }) {
  const tier = getTier(state.tierId);
  const homeSize = getHomeSize(state.homeSizeId);

  if (!quote) {
    return (
      <p className="muted">
        Please go back and make a few selections so we can show you a summary.
      </p>
    );
  }

  return (
    <div className="quote-summary-card">
      <div>
        <span className="text-eyebrow">Your quote</span>
        <h3 style={{ marginTop: 'var(--space-1)' }}>
          {QUOTE_TYPE_LABELS[state.quoteType] || 'Service quote'}
        </h3>
        <p className="muted" style={{ margin: 0 }}>
          {tier ? `${tier.name} tier` : ''}
          {tier && homeSize ? ' · ' : ''}
          {homeSize ? homeSize.label : ''}
          {quote.plan ? quote.plan.name : ''}
        </p>
      </div>

      {quote.materials?.length > 0 && (
        <div className="quote-summary-card__group">
          <h4>Equipment & materials</h4>
          <ul className="quote-summary-card__list">
            {quote.materials.map((m) => (
              <li key={m.id}>
                <span>{m.brand} {m.name}</span>
                <span>{formatCurrency(m.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="quote-summary-card__group">
        <h4>Cost breakdown</h4>
        {quote.materialSubtotal != null && (
          <div className="quote-summary-card__row">
            <span>Materials subtotal</span>
            <span>{formatCurrency(quote.materialSubtotal)}</span>
          </div>
        )}
        {quote.diagnostic != null && quote.diagnostic > 0 && (
          <div className="quote-summary-card__row">
            <span>Diagnostic fee</span>
            <span>{formatCurrency(quote.diagnostic)}</span>
          </div>
        )}
        {quote.labor && (
          <div className="quote-summary-card__row">
            <span>Labour ({quote.labor.hours} hr × {formatCurrency(quote.labor.rate)})</span>
            <span>{formatCurrency(quote.labor.subtotal)}</span>
          </div>
        )}
        {quote.plan && (
          <div className="quote-summary-card__row">
            <span>{quote.plan.name} plan (annual)</span>
            <span>{formatCurrency(quote.subtotal)}</span>
          </div>
        )}
        <div className="quote-summary-card__row">
          <span>Subtotal</span>
          <span>{formatCurrency(quote.subtotal)}</span>
        </div>
        <div className="quote-summary-card__row">
          <span>GST (5%)</span>
          <span>{formatCurrency(quote.gst)}</span>
        </div>
        <div
          className="quote-summary-card__row"
          style={{ borderBottom: 0, fontSize: 'var(--fs-md)', paddingTop: 'var(--space-3)' }}
        >
          <span style={{ fontWeight: 'var(--fw-bold)' }}>Total</span>
          <span style={{ color: 'var(--color-brand-700)', fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-black)' }}>
            {formatCurrency(quote.total)}
          </span>
        </div>
      </div>

      <p className="quote-summary__note">
        Submitting this quote sends it to a Method dispatcher. We'll call within one business hour
        (or the next morning if it's after 7 PM) to confirm details, schedule your no-charge in-home
        assessment, and finalize pricing — no payment is collected today.
      </p>
    </div>
  );
}
