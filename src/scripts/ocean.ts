// The physics shown on the gauge. Typical open-ocean values: real water varies by place and season.
// Sources: NOAA (pressure rises about 1 atmosphere per 10 m; light rarely matters below 200 m and is
// gone below 1,000 m; deep water below about 200 m averages about 4 °C).

export const pressureAtm = (m: number) => 1 + m / 10.06;

export function tempC(m: number): number {
  if (m <= 200) return 18 - (14 * m) / 200;          // warm surface layer cooling through the thermocline
  if (m <= 1000) return 4;
  return 4 - (1.5 * Math.min(m - 1000, 3000)) / 3000; // slowly colder towards the abyss
}

export function lightPct(m: number): number {
  if (m >= 1000) return 0;
  return 100 * Math.exp(-m / 43);                     // about 1% left at 200 m
}

export function formatLight(p: number): string {
  if (p === 0) return 'none';
  if (p >= 10) return `${Math.round(p)}%`;
  if (p >= 1) return `${p.toFixed(1)}%`;
  if (p >= 0.01) return `${p.toFixed(2)}%`;
  return 'under 0.01%';
}
