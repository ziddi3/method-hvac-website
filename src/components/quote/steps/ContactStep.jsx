import { TextInput, TextArea, Select } from '../../ui/Form.jsx';
import { SITE } from '../../../config/site.js';

const PREFERRED_TIME_OPTIONS = [
  { value: 'morning',  label: 'Weekday morning (8 – 11 AM)' },
  { value: 'midday',   label: 'Weekday midday (11 AM – 2 PM)' },
  { value: 'afternoon',label: 'Weekday afternoon (2 – 5 PM)' },
  { value: 'evening',  label: 'Weekday evening (5 – 7 PM)' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'anytime',  label: 'Any time — pick what works for you' },
];

const CITY_OPTIONS = SITE.serviceArea.map((c) => ({ value: c, label: c }));

/**
 * Final step before summary — captures who Method should follow up with.
 * Required fields are validated by the wizard before it advances.
 */
export default function ContactStep({ state, setField, errors = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="contact-form__row">
        <TextInput
          label="First name"
          required
          value={state.contact.firstName || ''}
          error={errors.firstName}
          onChange={(e) => setField('contact', { ...state.contact, firstName: e.target.value })}
        />
        <TextInput
          label="Last name"
          required
          value={state.contact.lastName || ''}
          error={errors.lastName}
          onChange={(e) => setField('contact', { ...state.contact, lastName: e.target.value })}
        />
      </div>

      <div className="contact-form__row">
        <TextInput
          label="Email"
          type="email"
          required
          value={state.contact.email || ''}
          error={errors.email}
          onChange={(e) => setField('contact', { ...state.contact, email: e.target.value })}
        />
        <TextInput
          label="Phone"
          type="tel"
          required
          value={state.contact.phone || ''}
          error={errors.phone}
          onChange={(e) => setField('contact', { ...state.contact, phone: e.target.value })}
        />
      </div>

      <TextInput
        label="Street address"
        hint="Used to confirm we serve your area — never shared."
        value={state.contact.address || ''}
        onChange={(e) => setField('contact', { ...state.contact, address: e.target.value })}
      />

      <div className="contact-form__row">
        <Select
          label="City"
          required
          options={CITY_OPTIONS}
          placeholder="Select a city"
          value={state.contact.city || ''}
          error={errors.city}
          onChange={(e) => setField('contact', { ...state.contact, city: e.target.value })}
        />
        <TextInput
          label="Postal code"
          placeholder="T2B 1A2"
          value={state.contact.postal || ''}
          onChange={(e) => setField('contact', { ...state.contact, postal: e.target.value })}
        />
      </div>

      <Select
        label="Best time to call you"
        options={PREFERRED_TIME_OPTIONS}
        placeholder="Pick a time"
        value={state.contact.preferredTime || ''}
        onChange={(e) => setField('contact', { ...state.contact, preferredTime: e.target.value })}
      />

      <TextArea
        label="Anything else we should know?"
        rows={3}
        placeholder="Equipment age, problems you've noticed, access notes, pets at home, etc."
        value={state.contact.notes || ''}
        onChange={(e) => setField('contact', { ...state.contact, notes: e.target.value })}
      />
    </div>
  );
}
