// Shared by the dive and the practice dive: the depth ruler's landmark dots.
import type { Landmark } from '../data/landmarks';

// A landmark dot with its name and depth beside it, so the ruler says what each dot is.
export function markNode(l: Landmark, top: number): HTMLElement {
  const d = document.createElement('span');
  d.className = 'mark';
  d.style.top = `${top}px`;
  const label = document.createElement('span');
  label.className = 'mark-label';
  const depth = document.createElement('span');
  depth.className = 'mark-m';
  depth.textContent = `${l.m.toLocaleString('en-GB')} m`;
  label.append(`${l.short} `, depth);
  d.append(label);
  return d;
}
