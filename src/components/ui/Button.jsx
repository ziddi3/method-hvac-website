import { Link } from 'react-router-dom';
import './Button.css';

const buildClasses = ({ variant, size, block, className }) => {
  const classes = ['btn', `btn--${variant}`];
  if (size && size !== 'md') classes.push(`btn--${size}`);
  if (block) classes.push('btn--block');
  if (className) classes.push(className);
  return classes.join(' ');
};

/**
 * Polymorphic button.
 *  - <Button>Click</Button>              → <button>
 *  - <Button to="/quote">Quote</Button>  → <Link to="/quote">  (internal)
 *  - <Button href="tel:...">Call</Button>→ <a href="...">       (external/tel/mail)
 */
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  type,
  ...rest
}) {
  const classes = buildClasses({ variant, size, block, className });

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type || 'button'} className={classes} {...rest}>
      {children}
    </button>
  );
}
