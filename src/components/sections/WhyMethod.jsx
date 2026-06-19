import Section from '../ui/Section.jsx';

const REASONS = [
  {
    title: 'Transparent pricing, every time',
    body:
      'You see the same line-item breakdown we use internally — materials, labour, and GST.' +
      ' What you accept is exactly what you pay.',
  },
  {
    title: 'Ticketed gas fitters on every job',
    body:
      'Every furnace and gas appliance we install is finished by an Alberta-licensed Master ' +
      'Gas Fitter — and every install is permitted and inspected.',
  },
  {
    title: 'Sized for –35 °C winters',
    body:
      'We do a Manual J on every replacement so your system is sized for actual Alberta loads, ' +
      'not "whatever was there before."',
  },
  {
    title: 'We fix it once, then we stand behind it',
    body:
      'Up to 5 years of Method workmanship coverage on installs, on top of the manufacturer ' +
      'parts warranty. Maintenance plan members get extended labour coverage every year.',
  },
];

export default function WhyMethod() {
  return (
    <Section
      id="why"
      variant="muted"
      eyebrow="Why Method HVAC"
      title="No surprise fees. No high-pressure sales."
      subtitle="We built Method to be the HVAC company we'd want to call ourselves — straightforward, technical, and respectful of your time and your home."
    >
      <div className="why-grid">
        {REASONS.map((r, i) => (
          <article key={r.title} className="why-tile">
            <div className="why-tile__num">{String(i + 1).padStart(2, '0')}</div>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
