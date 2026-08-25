// Month options as [MM, label] pairs, e.g. ['01', 'January'].
export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const value = String(i + 1).padStart(2, '0');
  const label = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'long' });

  return [value, label] as const;
});

const CURRENT_YEAR = new Date().getFullYear();

// Years descending from the current year to 1970.
export const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1969 }, (_, i) =>
  String(CURRENT_YEAR - i),
);
