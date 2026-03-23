'use client';

export function NewsletterForm() {
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Your email"
        className="flex-1 rounded-lg border border-pyra-cream/20 bg-pyra-cream/10 px-3 py-2 text-sm text-pyra-cream placeholder:text-pyra-cream/50 focus:border-pyra-gold focus:outline-none focus:ring-1 focus:ring-pyra-gold"
      />
      <button
        type="submit"
        className="rounded-lg bg-pyra-gold px-4 py-2 text-sm font-medium text-pyra-walnut transition-colors hover:bg-pyra-gold/90"
      >
        Join
      </button>
    </form>
  );
}
