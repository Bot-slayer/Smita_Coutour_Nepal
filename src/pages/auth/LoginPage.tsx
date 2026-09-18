import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If redirected from checkout or elsewhere
  const from = (location.state as { from?: string })?.from || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await authService.login({ email, password });
      setUser(user);
      toast.success(`Welcome back, ${user.displayName}!`);
      navigate(from);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-ivory">
      <div className="w-full max-w-md bg-white border border-border/80 p-8 sm:p-10 shadow-lg">
        {/* Brand Heading */}
        <div className="text-center mb-8">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-sans font-medium block mb-2">
            Haute Couture Salon
          </span>
          <Link to="/" className="font-serif text-2xl tracking-widest uppercase text-charcoal font-medium">
            Smita Couture Nepal
          </Link>
          <p className="text-xs text-taupe mt-3 font-sans">
            Sign in to access your saved wardrobe, track couture orders, and manage bespoke requests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans text-xs">
          {/* Email Address */}
          <div>
            <label className="tracking-widest uppercase text-taupe block mb-1.5 font-medium">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@domain.com"
                className="form-input pl-9"
              />
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="tracking-widest uppercase text-taupe font-medium">
                Password *
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-taupe hover:text-gold transition-colors underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="form-input pl-9 pr-10"
              />
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-charcoal transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full py-3.5 tracking-[0.2em] mt-2 flex items-center justify-center gap-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <span>{loading ? 'Authenticating…' : 'Sign In'}</span>
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <p className="text-center text-xs text-taupe mt-8 pt-6 border-t border-border/70 font-sans">
          New to Smita Couture Nepal?{' '}
          <Link
            to="/register"
            className="text-charcoal font-semibold underline underline-offset-4 hover:text-gold transition-colors"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
