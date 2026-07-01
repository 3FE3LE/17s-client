// Day-1 vertical slice: placeholder. The real care-circle dashboard
// lands when the @17suit/module-nine-care-companion module is populated
// and the backend serves `/nine-care-companion/care-circles/me`.

export default function HomePage() {
  return (
    <main style={{ padding: 'var(--spacing-lg)', maxWidth: 960, margin: '0 auto' }}>
      <h1
        style={{
          fontFamily: 'var(--font-arvo, serif)',
          fontSize: 'clamp(32px, 5vw, 56px)',
          lineHeight: 1.1,
          margin: '0 0 var(--spacing-md)',
        }}
      >
        Nine Care Companion
      </h1>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.5,
          color: 'var(--color-muted, #555)',
          maxWidth: '52ch',
          margin: '0 0 var(--spacing-md)',
        }}
      >
        Care coordination for families managing a loved one&apos;s daily routines. Backend is the
        single source of truth; the dashboard reads from
        <code> /nine-care-companion/care-circles/me</code>.
      </p>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: 'var(--color-muted, #888)',
          maxWidth: '52ch',
        }}
      >
        This page is a Day-1 placeholder. The product spec (Care Circle, Daily Timeline, Medication
        Confirmations) lands as the backend module ships.
      </p>
    </main>
  );
}
