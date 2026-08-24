export default function SectionDivider() {
  return (
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8" aria-hidden="true">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold/60" />
    </div>
  );
}
