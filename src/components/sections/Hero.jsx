import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import { formatCurrencyWhole } from '../../lib/format.js';
import { yearsInBusiness } from '../../config/site.js';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__grid">
          <div>
            <span className="hero__eyebrow">
              <Icon name="badge" size={12} />
              Alberta-owned · Master Gas Fitter
            </span>
            <h1>
              Honest HVAC pricing for Alberta homes. <em>It's all in the Method.</em>
            </h1>
            <p className="hero__lede">
              Build a transparent furnace, AC, or maintenance quote in under three minutes —
              no salespeople, no surprise fees, no pressure. The price you see is the price
              you pay, GST and all.
            </p>
            <div className="hero__ctas">
              <Button to="/quote" variant="primary" size="lg">
                Build Your Quote
                <Icon name="arrowRight" size={16} />
              </Button>
              <Button to="/services" variant="secondary" size="lg">
                Explore Services
              </Button>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-num">{yearsInBusiness()}+</span>
                <span className="hero__stat-label">Years installing</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-num">4,800+</span>
                <span className="hero__stat-label">Alberta homes</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-num">4.9★</span>
                <span className="hero__stat-label">Google reviews</span>
              </div>
            </div>
          </div>

          {/* Stylized "preview" of the quote builder output */}
          <div className="hero__card" aria-hidden>
            <div className="hero__card-header">
              <span className="hero__card-header-mark">
                <Icon name="spark" size={18} stroke={2.2} />
              </span>
              <div>
                <h3>Your Method Quote</h3>
                <p>Two-stage furnace · 1,800–2,400 sq ft</p>
              </div>
            </div>
            <div className="hero__card-rows">
              <div className="hero__card-row">
                <span>Carrier 80k BTU two-stage furnace</span>
                <span>{formatCurrencyWhole(3690)}</span>
              </div>
              <div className="hero__card-row">
                <span>ecobee Smart Enhanced thermostat</span>
                <span>{formatCurrencyWhole(289)}</span>
              </div>
              <div className="hero__card-row">
                <span>AprilAire 600 humidifier</span>
                <span>{formatCurrencyWhole(545)}</span>
              </div>
              <div className="hero__card-row">
                <span>Labour (8 hrs)</span>
                <span>{formatCurrencyWhole(1334)}</span>
              </div>
              <div className="hero__card-row">
                <span>GST (5%)</span>
                <span>{formatCurrencyWhole(293)}</span>
              </div>
            </div>
            <div className="hero__card-total">
              <span className="hero__card-total-label">Total, all-in</span>
              <span className="hero__card-total-amount">{formatCurrencyWhole(6151)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
