/**
 * Home size options used during the quote wizard. The `baseLaborHours`
 * column drives the labor portion of the pricing engine.
 */
export const HOME_SIZES = [
  {
    id: 'under1200',
    label: 'Under 1,200 sq ft',
    description: 'Bungalow, condo, townhouse, or small starter home.',
    baseLaborHours: 6,
    recommendedTons: 1.5,
    recommendedBtu: 60_000,
  },
  {
    id: '1200to1800',
    label: '1,200 – 1,800 sq ft',
    description: 'Typical two-storey or larger bungalow with finished basement.',
    baseLaborHours: 7,
    recommendedTons: 2,
    recommendedBtu: 80_000,
  },
  {
    id: '1800to2400',
    label: '1,800 – 2,400 sq ft',
    description: 'Larger two-storey homes — most Calgary and Edmonton builds.',
    baseLaborHours: 8,
    recommendedTons: 3,
    recommendedBtu: 80_000,
  },
  {
    id: 'over2400',
    label: 'Over 2,400 sq ft',
    description: 'Estate homes, walk-out basements, or two-furnace builds.',
    baseLaborHours: 10,
    recommendedTons: 4,
    recommendedBtu: 110_000,
  },
];

export const getHomeSize = (id) => HOME_SIZES.find((h) => h.id === id);
