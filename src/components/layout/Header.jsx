import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { SITE } from '../../config/site.js';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import MethodHubLink from './MethodHubLink.jsx';

const NAV_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/quote',    label: 'Build Your Quote' },
  { to: '/about',    label: 'About' },
  { to: '/contact',  label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [lastPath, setLastPath] = useState(location.pathname);

  // Close mobile drawer whenever the route changes. Uses the "storing
  // information from previous renders" pattern — comparing the previous
  // pathname kept in state with the current one — so we never call
  // setState from inside an effect.
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    if (open) setOpen(false);
  }

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__contacts">
            <a href={SITE.phoneHref}>
              <Icon name="phone" size={12} /> {SITE.phone}
            </a>
            <a href={SITE.emailHref}>
              <Icon name="mail" size={12} /> {SITE.email}
            </a>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Icon name="map" size={12} /> Serving Calgary, Edmonton & all of Alberta
            </span>
          </div>
          <MethodHubLink compact />
        </div>
      </div>

      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="header__logo" aria-label="Method HVAC — Home">
            <span className="header__logo-mark">
              <Icon name="spark" size={20} stroke={2.2} />
            </span>
            <span className="header__logo-name">
              <span>Method HVAC</span>
              <span className="header__logo-tag">{SITE.tagline}</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <Button to="/quote" variant="primary" size="sm" className="header__cta">
              Get a Quote
              <Icon name="arrowRight" size={14} />
            </Button>
            <button
              type="button"
              className="header__menu-btn"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="mnav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="mnav__panel">
            <button
              type="button"
              className="mnav__close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <Icon name="close" size={22} />
            </button>

            <nav aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `mnav__link${isActive ? ' mnav__link--active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <Button to="/quote" variant="primary" block>
              Build Your Quote
              <Icon name="arrowRight" size={16} />
            </Button>
            <Button href={SITE.phoneHref} variant="secondary" block>
              <Icon name="phone" size={16} />
              Call {SITE.phone}
            </Button>

            <div style={{ marginTop: 'auto' }}>
              <MethodHubLink />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
