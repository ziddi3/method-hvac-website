import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ScrollToTop from './ScrollToTop.jsx';

/**
 * Site shell — sticky header, main content slot, and footer.
 */
export default function Layout({ children }) {
  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main">Skip to main content</a>
      <Header />
      <main id="main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
