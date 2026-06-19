import { useState, useCallback } from 'react';

/**
 * Lightweight controlled-form helper.
 *  - values        — current field values
 *  - update(field) — returns an onChange handler
 *  - setField      — directly sets a single field
 *  - reset         — clears back to initial
 */
export default function useFormState(initial) {
  const [values, setValues] = useState(initial);

  const update = useCallback(
    (field) => (e) => {
      const next = e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value;
      setValues((prev) => ({ ...prev, [field]: next }));
    },
    [],
  );

  const setField = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => setValues(initial), [initial]);

  return { values, setValues, update, setField, reset };
}
