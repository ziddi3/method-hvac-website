import Hero from '../components/sections/Hero.jsx';
import ServicesOverview from '../components/sections/ServicesOverview.jsx';
import WhyMethod from '../components/sections/WhyMethod.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import QuoteCTA from '../components/sections/QuoteCTA.jsx';
import Financing from '../components/sections/Financing.jsx';
import ContactSection from '../components/sections/ContactSection.jsx';

import '../components/sections/Sections.css';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <WhyMethod />
      <Testimonials />
      <QuoteCTA />
      <Financing />
      <ContactSection variant="muted" compact />
    </>
  );
}
