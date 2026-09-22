/** RepublicOfData.io brand mark (signal arcs and ridge bars), drawn in currentColor. */
export default function RodMark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 26a12 12 0 0 1 20 0" />
      <path d="M10 26a8 8 0 0 1 12 0" />
      <path d="M14 26a4 4 0 0 1 4 0" />
      <path d="M8 8h16M8 13h10M8 18h6" />
    </svg>
  );
}
