import { useState } from 'react';
import { TextInput, TextArea, Select } from '../ui/Form.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import useFormState from '../../hooks/useFormState.js';
import { isEmail, isPhone, required, validate } from '../../lib/validate.js';
import { submitContactToGHL } from '../../lib/integrations/gohighlevel.js';

const TOPICS = [
  { value: 'quote',       label: 'I want a quote for a new install' },
  { value: 'repair',      label: 'My system needs a repair' },
  { value: 'maintenance', label: 'I want to join a maintenance plan' },
  { value: 'iaq',         label: 'I have questions about air quality' },
  { value: 'other',       label: 'Something else' },
];

const INITIAL = {
  firstName: '',
  lastName:  '',
  email:     '',
  phone:     '',
  city:      '',
  topic:     'quote',
  message:   '',
};

const RULES = {
  firstName: [[required, 'First name is required.']],
  lastName:  [[required, 'Last name is required.']],
  email:     [[required, 'Email is required.'], [isEmail, 'Enter a valid email address.']],
  phone:     [[required, 'Phone is required.'], [isPhone, 'Enter a valid phone number.']],
  message:   [[required, 'Tell us a bit about what you need.']],
};

export default function ContactForm({ compact = false }) {
  const { values, update, reset } = useFormState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle' });

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values, RULES);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus({ state: 'submitting' });
    try {
      const res = await submitContactToGHL({
        contact: values,
        subject: `Website contact — ${values.topic}`,
        message: values.message,
      });
      setStatus({ state: 'success', reference: res.reference });
      reset();
    } catch (err) {
      setStatus({ state: 'error', error: err?.message || 'Something went wrong.' });
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      {status.state === 'success' && (
        <div className="form-success" role="status">
          <strong>Thanks — message received.</strong><br />
          A Method team member will reply within one business day.
          Reference <code>{status.reference}</code>.
        </div>
      )}
      {status.state === 'error' && (
        <div className="form-error" role="alert">
          We couldn't send your message. Please try again, or call us directly.
        </div>
      )}

      <div className="contact-form__row">
        <TextInput
          label="First name"
          value={values.firstName}
          onChange={update('firstName')}
          autoComplete="given-name"
          error={errors.firstName}
          required
        />
        <TextInput
          label="Last name"
          value={values.lastName}
          onChange={update('lastName')}
          autoComplete="family-name"
          error={errors.lastName}
          required
        />
      </div>
      <div className="contact-form__row">
        <TextInput
          label="Email"
          type="email"
          value={values.email}
          onChange={update('email')}
          autoComplete="email"
          error={errors.email}
          required
        />
        <TextInput
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={update('phone')}
          autoComplete="tel"
          error={errors.phone}
          required
        />
      </div>
      {!compact && (
        <div className="contact-form__row">
          <TextInput
            label="City"
            value={values.city}
            onChange={update('city')}
            autoComplete="address-level2"
            placeholder="Calgary, Airdrie, Edmonton…"
          />
          <Select
            label="How can we help?"
            value={values.topic}
            onChange={update('topic')}
            options={TOPICS}
          />
        </div>
      )}
      <TextArea
        label="Message"
        value={values.message}
        onChange={update('message')}
        placeholder="Briefly describe what you need — system type, age, any symptoms…"
        error={errors.message}
        required
      />
      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status.state === 'submitting'}
        >
          {status.state === 'submitting' ? 'Sending…' : 'Send Message'}
          {status.state !== 'submitting' && <Icon name="arrowRight" size={16} />}
        </Button>
      </div>
      <p className="muted" style={{ fontSize: 'var(--fs-xs)' }}>
        By submitting, you agree to be contacted by Method HVAC. We never share or sell your details.
      </p>
    </form>
  );
}
