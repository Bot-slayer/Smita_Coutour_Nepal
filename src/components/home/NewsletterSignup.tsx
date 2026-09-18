import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    toast.success('Welcome to the Inner Circle!');
  };

  return (
    <section className="bg-charcoal py-20 sm:py-28 relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-ivory/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-ivory/3 rounded-full pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs tracking-widest-xl uppercase text-ivory/40 font-sans mb-5">
          Exclusive Access
        </p>
        <h2 className="font-serif text-display-sm text-ivory mb-4 leading-tight">
          Join the Inner Circle
        </h2>
        <p className="text-ivory/50 text-base leading-relaxed mb-10 max-w-md mx-auto">
          Be the first to receive new arrivals, members-only offers, styling inspiration,
          and invitations to exclusive Smita Couture events.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border border-gold/40 flex items-center justify-center">
              <span className="text-gold text-xl">✓</span>
            </div>
            <p className="text-ivory/70 text-sm">Thank you for joining. Welcome to the family.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-transparent border border-ivory/20 px-5 py-3.5 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              className="bg-gold text-charcoal px-6 py-3.5 text-xs tracking-widest-lg uppercase font-sans font-medium hover:bg-ivory transition-colors duration-200 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-ivory/25 text-xs mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
