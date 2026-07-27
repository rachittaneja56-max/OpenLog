export function scrollToEntry(entryId: string): void {
  const element = document.getElementById(`entry-${entryId}`);
  if (!element) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  element.focus({ preventScroll: true });
}
