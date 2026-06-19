import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import '../components/sections/Sections.css';

export default function NotFoundPage() {
  return (
    <section className="notfound">
      <div className="container">
        <p className="notfound__code">404</p>
        <h1 style={{ marginTop: 'var(--space-4)' }}>That page took the day off.</h1>
        <p className="muted" style={{ maxWidth: '480px', margin: '0 auto var(--space-8)' }}>
          The URL you followed isn't part of methodhvac.ca. Try the homepage, or jump
          straight into building a quote.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Button to="/" variant="primary">
            <Icon name="arrowLeft" size={16} /> Back to home
          </Button>
          <Button to="/quote" variant="secondary">
            Build Your Quote
          </Button>
        </div>
      </div>
    </section>
  );
}
