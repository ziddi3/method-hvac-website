import { formatCurrency } from '../../lib/format.js';
import { getHomeSize } from '../../data/homeSizes.js';
import { getTier } from '../../data/packages.js';
import { getMaintenancePlan } from '../../lib/pricing.js';

const QUOTE_TYPE_LABELS = {
  'ac-install': 'Air-conditioning install',
  'furnace-install': 'Furnace install',
  'repair': 'Service & repair',
  'maintenance': 'Maintenance plan',
};

/**
 * Sticky sidebar showing the running quote total + a live breakdown.
 * Re-renders as the wizard state changes.
 */
export default function QuoteSummary({ state, quote }) {
  const hasQuote = quote && quote.total > 0;
  const tier = getTier(state.tierId);
  const homeSize = getHomeSize(state.homeSizeId);
  const plan = state.quoteType === 'maintenance' ? getMaintenancePlan(state.maintenancePlanId) : null;

  return (
    <aside className="quote-summary" aria-label="Live quote summary">
      <div>
        <div className="quote-summary__total-label">Your running total (incl. GST)</div>
        <div className="quote-summary__total">
          {hasQuote ? formatCurrency(quote.total) : '$0.00'}
        </div>
        {state.quoteType && (
          <p className="muted" style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
            {QUOTE_TYPE_LABELS[state.quoteType]}
            {tier ? ` · ${tier.name} tier` : ''}
            {homeSize ? ` · ${homeSize.label}` : ''}
            {plan ? ` · ${plan.name}` : ''}
          </p>
        )}
      </div>

      {!hasQuote && (
        <p className="quote-summary__empty">
          Pick a service to start building your transparent line-item quote.
        </p>
      )}

      {hasQuote && (
        <>
          {quote.materials?.length > 0 && (
            <div>
              <div className="quote-summary__total-label" style={{ marginBottom: 'var(--space-2)' }}>
                Materials
              </div>
              <div className="quote-summary__materials">
                {quote.materials.map((m) => (
                  <div key={m.id} className="quote-summary__material">
                    <span>{m.name}</span>
                    <span>{formatCurrency(m.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="quote-summary__breakdown">
            {quote.materialSubtotal != null && (
              <div className="quote-summary__row">
                <span>Materials subtotal</span>
                <span>{formatCurrency(quote.materialSubtotal)}</span>
              </div>
            )}
            {quote.diagnostic != null && quote.diagnostic > 0 && (
              <div className="quote-summary__row">
                <span>Diagnostic fee</span>
                <span>{formatCurrency(quote.diagnostic)}</span>
              </div>
            )}
            {quote.labor && (
              <div className="quote-summary__row">
                <span>
                  Labour ({quote.labor.hours} hr × {formatCurrency(quote.labor.rate)})
                </span>
                <span>{formatCurrency(quote.labor.subtotal)}</span>
              </div>
            )}
            {quote.plan && (
              <div className="quote-summary__row">
                <span>{quote.plan.name} plan</span>
                <span>{formatCurrency(quote.subtotal)}</span>
              </div>
            )}
            <div className="quote-summary__row">
              <span>Subtotal</span>
              <span>{formatCurrency(quote.subtotal)}</span>
            </div>
            <div className="quote-summary__row">
              <span>GST (5%)</span>
              <span>{formatCurrency(quote.gst)}</span>
            </div>
            <div className="quote-summary__row quote-summary__row--total">
              <span>Total</span>
              <span>{formatCurrency(quote.total)}</span>
            </div>
          </div>

          <p className="quote-summary__note">
            Quote is non-binding and valid for 30 days. Final pricing confirmed after a
            no-charge in-home assessment with a Method technician.
          </p>
        </>
      )}
    </aside>
  );
}
