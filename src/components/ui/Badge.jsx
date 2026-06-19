import './Badge.css';

export default function Badge({ children, variant = 'default', className = '' }) {
  const classes = [
    'badge',
    variant !== 'default' && `badge--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <span className={classes}>{children}</span>;
}
