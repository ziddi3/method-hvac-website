import './Section.css';

/**
 * A vertically padded page section with an optional centered header
 * (eyebrow + title + subtitle).
 */
export default function Section({
  id,
  variant = 'default',
  size = 'md',
  eyebrow,
  title,
  subtitle,
  headerAlign = 'center',
  children,
  className = '',
}) {
  const sectionClass = [
    'section',
    size === 'sm' && 'section--tight',
    size === 'hero' && 'section--hero',
    variant === 'muted' && 'section--muted',
    variant === 'inverse' && 'section--inverse',
    variant === 'brand' && 'section--brand',
    variant === 'brand-soft' && 'section--brand-soft',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const headerClass = [
    'section__header',
    headerAlign === 'left' && 'section__header--left',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={sectionClass}>
      <div className="container">
        {(eyebrow || title || subtitle) && (
          <div className={headerClass}>
            {eyebrow && <span className="text-eyebrow">{eyebrow}</span>}
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
