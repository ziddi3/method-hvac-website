import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import QuotePage from './pages/QuotePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import './components/layout/Layout.css';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about"    element={<AboutPage />} />
        <Route path="/contact"  element={<ContactPage />} />
        <Route path="/quote"    element={<QuotePage />} />
        <Route path="*"         element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
