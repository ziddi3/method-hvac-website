import Section from '../ui/Section.jsx';
import Icon from '../ui/Icon.jsx';
import { TESTIMONIALS } from '../../data/testimonials.js';

function Stars({ count = 5 }) {
  return (
    <span className="tst__stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} name="star" size={16} stroke={0} fill="currentColor" />
      ))}
    </span>
  );
}

export default function Testimonials({ limit = 6 }) {
  const items = TESTIMONIALS.slice(0, limit);
  return (
    <Section
      id="testimonials"
      eyebrow="Customer stories"
      title="Loved by 4,800+ Alberta households."
      subtitle="We earn our 4.9-star rating one install, repair, and tune-up at a time."
    >
      <div className="tst-grid">
        {items.map((t) => (
          <figure key={t.id} className="tst">
            <Stars count={t.rating} />
            <blockquote className="tst__quote">"{t.quote}"</blockquote>
            <figcaption className="tst__meta">
              <strong>{t.name}</strong>
              {t.location} · {t.service}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
