import './Card.css';

/**
 * Versatile card container used for service tiles, package tiers,
 * testimonials, etc. Composable so callers control the inner layout.
 */
export default function Card({
  children,
  as: Tag = 'div',
  variant = 'default',     // 'default' | 'inverse'
  accent,                  // 'brand' | 'heat'
  padding = 'md',          // 'tight' | 'md' | 'lg'
  shadow = false,
  interactive = false,
  selected = false,
  flat = false,
  className = '',
  ...rest
}) {
  const classes = [
    'card',
    variant === 'inverse' && 'card--inverse',
    accent === 'brand' && 'card--accent-brand',
    accent === 'heat' && 'card--accent-heat',
    padding === 'tight' && 'card--tight',
    padding === 'lg' && 'card--padded',
    shadow && 'card--shadow',
    interactive && 'card--interactive',
    selected && 'card--selected',
    flat && 'card--flat',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
