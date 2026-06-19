import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import Section from '../components/ui/Section.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';

import QuoteStepper from '../components/quote/QuoteStepper.jsx';
import QuoteSummary from '../components/quote/QuoteSummary.jsx';
import ServiceTypeStep from '../components/quote/steps/ServiceTypeStep.jsx';
import HomeSizeStep from '../components/quote/steps/HomeSizeStep.jsx';
import PackageTierStep from '../components/quote/steps/PackageTierStep.jsx';
import MaterialsStep from '../components/quote/steps/MaterialsStep.jsx';
import EstimatedHoursStep from '../components/quote/steps/EstimatedHoursStep.jsx';
import MaintenancePlanStep from '../components/quote/steps/MaintenancePlanStep.jsx';
import ContactStep from '../components/quote/steps/ContactStep.jsx';
import SummaryStep from '../components/quote/steps/SummaryStep.jsx';

import { computeQuote, SERVICE_PRICING } from '../lib/pricing.js';
import { defaultMaterialsFor } from '../data/materials.js';
import { submitQuoteToGHL } from '../lib/integrations/gohighlevel.js';
import { isEmail, isPhone, required, validate } from '../lib/validate.js';
import { SITE } from '../config/site.js';
import { formatCurrency } from '../lib/format.js';

import '../components/quote/Quote.css';
import '../components/sections/Sections.css';

const STEP_DEFS = {
  serviceType:     { id: 'serviceType',     label: 'Service' },
  homeSize:        { id: 'homeSize',        label: 'Home size' },
  tier:            { id: 'tier',            label: 'Tier' },
  materials:       { id: 'materials',       label: 'Equipment' },
  estimatedHours:  { id: 'estimatedHours',  label: 'Scope' },
  maintenancePlan: { id: 'maintenancePlan', label: 'Plan' },
  contact:         { id: 'contact',         label: 'Contact' },
  summary:         { id: 'summary',         label: 'Review' },
};

/**
 * Per-quote-type step sequences. The wizard rebuilds its flow when
 * the customer picks a different service so we never show, e.g., a
 * package-tier step on a repair quote.
 */
const FLOWS = {
  'ac-install':      ['serviceType', 'homeSize', 'tier', 'materials', 'contact', 'summary'],
  'furnace-install': ['serviceType', 'homeSize', 'tier', 'materials', 'contact', 'summary'],
  'repair':          ['serviceType', 'estimatedHours', 'contact', 'summary'],
  'maintenance':     ['serviceType', 'maintenancePlan', 'contact', 'summary'],
  '__default':       ['serviceType'],
};

const STEP_COPY = {
  serviceType: {
    eyebrow: 'Step 1 of —',
    title: 'What kind of work are you quoting?',
    lede: 'Pick the service you need today. You can change this any time.',
  },
  homeSize: {
    eyebrow: 'Home size',
    title: 'How big is the home this system will heat or cool?',
    lede: 'This sets the base labour estimate and which equipment options fit.',
  },
  tier: {
    eyebrow: 'Equipment tier',
    title: 'Budget, Standard, or Premium?',
    lede: 'Choosing a tier seeds the materials list. You can swap anything in the next step.',
  },
  materials: {
    eyebrow: 'Equipment & materials',
    title: 'Build your line-item quote.',
    lede: 'Add, remove, or swap any item. Every change updates the running total on the right.',
  },
  estimatedHours: {
    eyebrow: 'Scope',
    title: 'Roughly how big is the repair?',
    lede: "If you're not sure — pick standard. We'll confirm the actual scope on-site.",
  },
  maintenancePlan: {
    eyebrow: 'Maintenance plan',
    title: 'Which plan fits your home?',
    lede: 'All plans are annual, billed up-front, and cancel-anytime.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Where should we send your quote?',
    lede: 'A Method dispatcher will follow up within one business hour to confirm the details.',
  },
  summary: {
    eyebrow: 'Review & send',
    title: 'Here\'s your transparent, line-item quote.',
    lede: 'Take one last look. When you submit, we\'ll line up your in-home assessment.',
  },
};

const initialContact = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postal: '',
  preferredTime: '',
  notes: '',
};

const initialState = {
  quoteType: '',
  homeSizeId: '',
  tierId: '',
  materials: [],
  estimatedHours: SERVICE_PRICING.minHours,
  maintenancePlanId: '',
  contact: initialContact,
};

/** Map ?service= query string values to internal quote types. */
const QUERY_SERVICE_MAP = {
  'ac-install': 'ac-install',
  'furnace-install': 'furnace-install',
  'repair': 'repair',
  'maintenance': 'maintenance',
  // also accept the service ids from src/data/services.js
  'thermostat': 'ac-install',
  'iaq': 'ac-install',
};

const CONTACT_RULES = {
  firstName: [[required, 'Please share your first name.']],
  lastName:  [[required, 'Please share your last name.']],
  email:     [[required, 'Email is required.'], [isEmail, 'Please enter a valid email.']],
  phone:     [[required, 'Phone is required.'], [isPhone, 'Please enter a valid phone number.']],
  city:      [[required, 'Please pick the city we\'ll be servicing.']],
};

export default function QuotePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [state, setState] = useState(() => {
    const initial = { ...initialState };
    const requested = params.get('service');
    if (requested && QUERY_SERVICE_MAP[requested]) {
      initial.quoteType = QUERY_SERVICE_MAP[requested];
    }
    return initial;
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [contactErrors, setContactErrors] = useState({});
  const [submitState, setSubmitState] = useState({ loading: false, error: null });
  const [confirmation, setConfirmation] = useState(null);

  // Choose the active flow based on the picked quote type.
  const flow = FLOWS[state.quoteType] || FLOWS.__default;
  const steps = useMemo(() => flow.map((id) => STEP_DEFS[id]), [flow]);
  const totalSteps = steps.length;
  // Clamp during render so flipping service types (and shrinking the flow)
  // never points at a non-existent step. No effect required.
  const safeStepIndex = Math.min(stepIndex, totalSteps - 1);
  const currentStep = steps[safeStepIndex];
  const isLast = safeStepIndex >= totalSteps - 1;

  const setField = (field, value) => {
    setState((prev) => {
      const next = { ...prev, [field]: value };
      // Changing service wipes downstream selections so the running summary stays honest.
      if (field === 'quoteType' && value !== prev.quoteType) {
        next.homeSizeId = '';
        next.tierId = '';
        next.materials = [];
        next.estimatedHours = SERVICE_PRICING.minHours;
        next.maintenancePlanId = '';
      }
      if (field === 'tierId' || field === 'homeSizeId') {
        // Re-seed materials when the install spec changes meaningfully.
        next.materials = [];
      }
      return next;
    });
    if (field === 'quoteType') setStepIndex(0);
  };

  /**
   * Seed sensible default materials right when the customer is about to
   * step into the materials picker. Lazy seeding avoids effect-driven setState.
   */
  const seedMaterialsIfNeeded = () => {
    if (!['ac-install', 'furnace-install'].includes(state.quoteType)) return;
    if (!state.homeSizeId || !state.tierId) return;
    if (state.materials.length > 0) return;
    const defaults = defaultMaterialsFor(state.quoteType, state.tierId, state.homeSizeId);
    setState((prev) => ({ ...prev, materials: defaults }));
  };

  const quote = useMemo(() => computeQuote(state), [state]);

  /** Validate the current step before letting the customer advance. */
  const canAdvance = () => {
    switch (currentStep?.id) {
      case 'serviceType':
        return !!state.quoteType;
      case 'homeSize':
        return !!state.homeSizeId;
      case 'tier':
        return !!state.tierId;
      case 'materials':
        return state.materials.length > 0;
      case 'estimatedHours':
        return state.estimatedHours >= SERVICE_PRICING.minHours;
      case 'maintenancePlan':
        return !!state.maintenancePlanId;
      case 'contact': {
        const errs = validate(state.contact, CONTACT_RULES);
        setContactErrors(errs);
        return Object.keys(errs).length === 0;
      }
      default:
        return true;
    }
  };

  const onNext = () => {
    if (!canAdvance()) return;
    setContactErrors({});
    if (safeStepIndex < totalSteps - 1) {
      const nextStep = steps[safeStepIndex + 1];
      if (nextStep?.id === 'materials') {
        seedMaterialsIfNeeded();
      }
      setStepIndex(safeStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onBack = () => {
    if (safeStepIndex > 0) setStepIndex(safeStepIndex - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async () => {
    if (!quote || quote.total <= 0) return;
    setSubmitState({ loading: true, error: null });
    try {
      const result = await submitQuoteToGHL({
        quote: { ...quote, tierId: state.tierId, homeSizeId: state.homeSizeId },
        contact: state.contact,
      });
      if (!result?.success) throw new Error('Submission failed');
      setConfirmation({ reference: result.reference });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitState({
        loading: false,
        error: 'We couldn\'t send your quote — please try again or call us at ' + SITE.phone + '.',
      });
      console.error('Quote submission error', err);
      return;
    }
    setSubmitState({ loading: false, error: null });
  };

  /** Render the body for the active step. */
  const renderStep = () => {
    switch (currentStep?.id) {
      case 'serviceType':
        return <ServiceTypeStep state={state} setField={setField} />;
      case 'homeSize':
        return <HomeSizeStep state={state} setField={setField} />;
      case 'tier':
        return <PackageTierStep state={state} setField={setField} />;
      case 'materials':
        return <MaterialsStep state={state} setField={setField} />;
      case 'estimatedHours':
        return <EstimatedHoursStep state={state} setField={setField} />;
      case 'maintenancePlan':
        return <MaintenancePlanStep state={state} setField={setField} />;
      case 'contact':
        return <ContactStep state={state} setField={setField} errors={contactErrors} />;
      case 'summary':
        return <SummaryStep state={state} quote={quote} />;
      default:
        return null;
    }
  };

  /** Show a confirmation success screen once the quote has been sent. */
  if (confirmation) {
    return (
      <Section
        variant="brand-soft"
        size="md"
        eyebrow="Quote sent"
        title="Thanks — your quote is on its way."
      >
        <div className="quote-success">
          <span className="quote-success__check" aria-hidden>
            <Icon name="check" size={28} stroke={2.6} />
          </span>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>
            We've sent your transparent quote of {formatCurrency(quote?.total || 0)} to a Method dispatcher.
          </h3>
          <p className="muted" style={{ maxWidth: '520px' }}>
            A licensed technician will reach out within one business hour to confirm details,
            answer questions, and schedule your no-charge in-home assessment.
          </p>
          <span className="quote-success__ref">Reference {confirmation.reference}</span>
          <div className="quote-success__actions">
            <Button to="/" variant="primary">Back to home</Button>
            <Button to="/services" variant="secondary">Explore services</Button>
            <Button href={SITE.phoneHref} variant="ghost">
              <Icon name="phone" size={16} /> Call us at {SITE.phone}
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  const copy = STEP_COPY[currentStep?.id] || {};
  const dynamicEyebrow = `Step ${safeStepIndex + 1} of ${totalSteps}`;

  return (
    <Section size="md" eyebrow="Build your quote" title="Transparent. Itemized. No pressure.">
      <div className="quote-grid quote-shell">
        <div>
          <QuoteStepper steps={steps} currentIndex={safeStepIndex} />

          <div className="quote-stage">
            <header className="quote-stage__header">
              <span className="quote-stage__eyebrow">{dynamicEyebrow} · {copy.eyebrow || ''}</span>
              <h2 className="quote-stage__title">{copy.title}</h2>
              {copy.lede && <p className="quote-stage__lede">{copy.lede}</p>}
            </header>

            {renderStep()}

            {submitState.error && (
              <div className="form-error" role="alert" style={{ marginTop: 'var(--space-6)' }}>
                {submitState.error}
              </div>
            )}

            <footer className="quote-footer">
              <span className="quote-footer__progress">
                Step {safeStepIndex + 1} of {totalSteps}
              </span>
              <div className="quote-footer__actions">
                {safeStepIndex > 0 && (
                  <Button variant="ghost" onClick={onBack} disabled={submitState.loading}>
                    <Icon name="arrowLeft" size={16} /> Back
                  </Button>
                )}
                {isLast ? (
                  <Button
                    variant="primary"
                    onClick={onSubmit}
                    disabled={submitState.loading || !quote || quote.total <= 0}
                  >
                    {submitState.loading ? 'Sending…' : 'Send my quote'}
                    {!submitState.loading && <Icon name="arrowRight" size={16} />}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={onNext}
                    disabled={!state.quoteType && safeStepIndex === 0}
                  >
                    Continue <Icon name="arrowRight" size={16} />
                  </Button>
                )}
              </div>
            </footer>
          </div>

          <p className="muted" style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: 'var(--fs-sm)' }}>
            Prefer to talk it through?{' '}
            <a href={SITE.phoneHref}>Call {SITE.phone}</a>
            {' '}or{' '}
            <button
              type="button"
              onClick={() => navigate('/contact')}
              style={{ color: 'var(--color-brand-600)', textDecoration: 'underline', fontWeight: 'var(--fw-medium)' }}
            >
              send us a message
            </button>.
          </p>
        </div>

        <QuoteSummary state={state} quote={quote} />
      </div>
    </Section>
  );
}
