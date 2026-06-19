import './Form.css';

let idCounter = 0;
const uid = (prefix) => `${prefix}-${++idCounter}`;

export function Field({ label, hint, error, required, htmlFor, children }) {
  return (
    <div className="field field--block">
      {label && (
        <label className="field__label" htmlFor={htmlFor}>
          {label}
          {required && <span className="field__required" aria-hidden>*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="field__error" role="alert">{error}</span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  );
}

export function TextInput({
  label, hint, error, required, type = 'text', id, ...rest
}) {
  const inputId = id || uid('input');
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
      <input
        id={inputId}
        type={type}
        className={`input${error ? ' input--error' : ''}`}
        required={required}
        {...rest}
      />
    </Field>
  );
}

export function TextArea({
  label, hint, error, required, id, ...rest
}) {
  const inputId = id || uid('ta');
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
      <textarea
        id={inputId}
        className={`textarea${error ? ' textarea--error' : ''}`}
        required={required}
        {...rest}
      />
    </Field>
  );
}

export function Select({
  label, hint, error, required, id, options = [], placeholder, ...rest
}) {
  const inputId = id || uid('sel');
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
      <select
        id={inputId}
        className={`select${error ? ' select--error' : ''}`}
        required={required}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </Field>
  );
}

/**
 * Radio card — used in the quote wizard's selection steps.
 * Click toggles via the passed onChange handler.
 */
export function RadioCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  children,
}) {
  const handleKey = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(value);
    }
  };
  return (
    <label
      className={`radio-card${checked ? ' radio-card--selected' : ''}`}
      onKeyDown={handleKey}
      tabIndex={0}
      role="radio"
      aria-checked={checked}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange?.(value)}
      />
      {title && <div className="radio-card__title">{title}</div>}
      {description && <div className="radio-card__sub">{description}</div>}
      {children}
    </label>
  );
}

/** Same visual as RadioCard but supports multi-select. */
export function CheckboxCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  children,
}) {
  const handleKey = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(value, !checked);
    }
  };
  return (
    <label
      className={`radio-card${checked ? ' radio-card--selected' : ''}`}
      onKeyDown={handleKey}
      tabIndex={0}
      role="checkbox"
      aria-checked={checked}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(value, e.target.checked)}
      />
      {title && <div className="radio-card__title">{title}</div>}
      {description && <div className="radio-card__sub">{description}</div>}
      {children}
    </label>
  );
}
