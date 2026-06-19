import { Link } from 'react-router-dom';
import Section from '../ui/Section.jsx';
import Card from '../ui/Card.jsx';
import Icon from '../ui/Icon.jsx';
import { SERVICES } from '../../data/services.js';
import { formatCurrencyWhole } from '../../lib/format.js';

export default function ServicesOverview() {
  return (
    <Section
      id="services-overview"
      eyebrow="What we do"
      title="Everything that keeps your home comfortable."
      subtitle="From an emergency repair to a top-of-the-line install, we cover every part of an Alberta home's HVAC stack."
    >
      <div className="svc-grid">
        {SERVICES.map((service) => (
          <Card
            key={service.id}
            accent={service.accent}
            shadow
            className="svc-tile"
          >
            <span className={`card__icon${service.accent === 'heat' ? ' card__icon--heat' : ''}`}>
              <Icon name={service.icon} size={22} />
            </span>
            <h3 className="card__title">
              {service.title}
              <span className="svc-tile__from">
                from {formatCurrencyWhole(service.startingAt)}
              </span>
            </h3>
            <p>{service.short}</p>
            <ul className="svc-tile__bullets">
              {service.bullets.slice(0, 3).map((b) => (
                <li key={b}><Icon name="check" size={14} stroke={2.4} /> <span>{b}</span></li>
              ))}
            </ul>
            <div className="card__footer">
              <Link to={`/services#${service.id}`}>Learn more →</Link>
              <Link to={`/quote?service=${service.quoteType}`}>Get a quote</Link>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
