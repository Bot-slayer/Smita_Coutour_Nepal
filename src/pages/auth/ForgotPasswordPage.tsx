import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
    toast.success('Reset instructions sent!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-xl tracking-widest-lg uppercase text-charcoal font-medium">
            Smita Couture Nepal
          </Link>
          <p className="text-taupe text-sm mt-3">Reset your password</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 border border-gold flex items-center justify-center mx-auto mb-5">
              <span className="text-gold text-2xl">✓</span>
            </div>
            <h2 className="font-serif text-xl text-charcoal mb-3">Check Your Email</h2>
            <p className="text-taupe text-sm mb-8">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <Link to="/login" className="btn-outline">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="text-taupe text-sm mb-8 text-center">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-xs tracking-widest uppercase text-taupe block mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="form-input"
                />
              </div>
              <button type="submit" disabled={loading} className={`btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <Link to="/login" className="flex items-center justify-center gap-2 mt-6 text-xs text-taupe hover:text-gold transition-colors">
              <ArrowLeft size={13} /> Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
