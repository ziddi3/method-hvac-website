import { useMemo } from 'react';
import { MATERIAL_CATEGORIES, materialsForQuoteType } from '../../../data/materials.js';
import { formatCurrencyWhole } from '../../../lib/format.js';

/**
 * Step 4 (install) — line-item materials selector.
 *
 * Defaults are seeded by the wizard from `defaultMaterialsFor(quoteType, tier, homeSize)`
 * when the customer enters this step, but they can freely toggle anything.
 *
 * Materials are grouped by category and (for AC / furnace) filtered by home size
 * so customers see units that actually fit their home.
 */
const CATEGORY_LABELS = {
  [MATERIAL_CATEGORIES.AC]: 'Air conditioner',
  [MATERIAL_CATEGORIES.FURNACE]: 'Furnace',
  [MATERIAL_CATEGORIES.THERMOSTAT]: 'Thermostat',
  [MATERIAL_CATEGORIES.IAQ]: 'Indoor air quality',
  [MATERIAL_CATEGORIES.ACCESSORY]: 'Install accessories',
};

const CATEGORY_HINTS = {
  [MATERIAL_CATEGORIES.AC]: 'Pick one — your home size narrows the list automatically.',
  [MATERIAL_CATEGORIES.FURNACE]: 'Pick one — sized appropriately for your square footage.',
  [MATERIAL_CATEGORIES.THERMOSTAT]: 'Pick one — your tier includes the recommended option.',
  [MATERIAL_CATEGORIES.IAQ]: 'Optional upgrades — humidity, filtration, fresh air, and UV.',
  [MATERIAL_CATEGORIES.ACCESSORY]: 'Code-required and quality-of-life upgrades.',
};

const SINGLE_SELECT_CATEGORIES = new Set([
  MATERIAL_CATEGORIES.AC,
  MATERIAL_CATEGORIES.FURNACE,
  MATERIAL_CATEGORIES.THERMOSTAT,
]);

export default function MaterialsStep({ state, setField }) {
  const pool = useMemo(
    () => materialsForQuoteType(state.quoteType),
    [state.quoteType],
  );

  // Filter AC/furnace options by selected home size so customers don't see
  // units that won't fit their home (e.g. 4-ton AC on a 900 sq ft bungalow).
  const visiblePool = useMemo(() => {
    if (!state.homeSizeId) return pool;
    return pool.filter((m) => !m.fitsHomeSize || m.fitsHomeSize.includes(state.homeSizeId));
  }, [pool, state.homeSizeId]);

  // Group by category, preserve catalog order.
  const groups = useMemo(() => {
    const map = new Map();
    visiblePool.forEach((m) => {
      const list = map.get(m.category) || [];
      list.push(m);
      map.set(m.category, list);
    });
    return Array.from(map.entries());
  }, [visiblePool]);

  const selectedIds = new Set((state.materials || []).map((m) => m.id));

  const toggle = (material, isSingleSelect) => {
    const isOn = selectedIds.has(material.id);
    let next;
    if (isOn) {
      next = state.materials.filter((m) => m.id !== material.id);
    } else if (isSingleSelect) {
      // Single-select: remove any other item in the same category.
      next = [
        ...state.materials.filter((m) => m.category !== material.category),
        material,
      ];
    } else {
      next = [...state.materials, material];
    }
    setField('materials', next);
  };

  return (
    <div className="quote-materials">
      {groups.map(([category, items]) => {
        const single = SINGLE_SELECT_CATEGORIES.has(category);
        return (
          <div key={category} className="quote-materials__group">
            <h4>
              {CATEGORY_LABELS[category] || category}
              <span className="quote-materials__group-tag">
                {single ? 'Pick one' : 'Add any'}
              </span>
            </h4>
            <p>{CATEGORY_HINTS[category]}</p>
            <div className="quote-materials__list">
              {items.map((m) => {
                const isOn = selectedIds.has(m.id);
                const includedInTier = state.tierId && m.includedIn.includes(state.tierId);
                return (
                  <label
                    key={m.id}
                    className={`material-row${isOn ? ' material-row--selected' : ''}`}
                  >
                    <div className="material-row__top">
                      <div className="material-row__title">
                        <input
                          type={single ? 'radio' : 'checkbox'}
                          name={`mat-${category}`}
                          checked={isOn}
                          onChange={() => toggle(m, single)}
                        />
                        <div>
                          {m.name}
                          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-ink-500)', fontWeight: 'normal' }}>
                            {m.brand} · {m.sku}
                          </div>
                        </div>
                      </div>
                      <span className="material-row__price">{formatCurrencyWhole(m.price)}</span>
                    </div>
                    <p className="material-row__desc">{m.description}</p>
                    <div className="material-row__tags">
                      {includedInTier && (
                        <span className="material-row__tag material-row__tag--included">
                          Included in {state.tierId}
                        </span>
                      )}
                      {(m.tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="material-row__tag">{tag}</span>
                      ))}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
