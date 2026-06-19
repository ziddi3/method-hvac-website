import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';

export default function QuoteCTA() {
  return (
    <section style={{ paddingBlock: 'clamp(3rem, 1.5rem + 5vw, 5rem)' }}>
      <div className="container">
        <div className="cta-band">
          <div>
            <span className="text-eyebrow" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Build your own quote
            </span>
            <h2>Get an itemized, all-in HVAC price in 3 minutes.</h2>
            <p>
              Pick your service, your home size, and your tier — we'll match
              the right Goodman, Carrier, or Lennox equipment, calculate the
              labour and GST, and email you a clean PDF you can keep.
            </p>
          </div>
          <div className="cta-band__actions">
            <Button to="/quote" variant="inverse" size="lg">
              Start My Quote
              <Icon name="arrowRight" size={16} />
            </Button>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.75)' }}>
              No phone calls required · Free · Instant total
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
