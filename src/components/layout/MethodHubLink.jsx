import { SITE } from '../../config/site.js';
import Icon from '../ui/Icon.jsx';

/**
 * Visible "Return to Method Hub" link. Centralized so every page surfaces
 * the same navigation back into the wider Method ecosystem.
 */
export default function MethodHubLink({ compact = false, className = '' }) {
  return (
    <a
      href={SITE.hubUrl}
      className={`hub-link ${className}`}
      aria-label={SITE.hubLabel}
    >
      <span className="hub-link__dot" aria-hidden />
      {compact ? 'Method Hub' : SITE.hubLabel}
      <Icon name="arrowRight" size={14} />
    </a>
  );
}
