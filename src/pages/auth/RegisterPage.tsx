import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      setUser(user);
      toast.success(`Welcome to Smita Couture Nepal, ${user.displayName}!`);
      navigate('/account');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
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
            Haute Couture Membership
          </span>
          <Link to="/" className="font-serif text-2xl tracking-widest uppercase text-charcoal font-medium">
            Smita Couture Nepal
          </Link>
          <p className="text-xs text-taupe mt-3 font-sans">
            Create your client profile for exclusive private sales, order tracking, and bespoke consultations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-xs">
          {/* Full Name */}
          <div>
            <label className="tracking-widest uppercase text-taupe block mb-1.5 font-medium">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.fullName}
                onChange={set('fullName')}
                required
                placeholder="e.g. Smita Shrestha"
                className="form-input pl-9"
              />
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="tracking-widest uppercase text-taupe block mb-1.5 font-medium">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="you@domain.com"
                className="form-input pl-9"
              />
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
            </div>
          </div>

          {/* Phone Number (Specifically Required in Section 15) */}
          <div>
            <label className="tracking-widest uppercase text-taupe block mb-1.5 font-medium">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                required
                placeholder="+977 98XXXXXXXX"
                className="form-input pl-9"
              />
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="tracking-widest uppercase text-taupe block mb-1.5 font-medium">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
                placeholder="Min. 6 characters"
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

          {/* Confirm Password */}
          <div>
            <label className="tracking-widest uppercase text-taupe block mb-1.5 font-medium">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                required
                placeholder="Repeat password"
                className="form-input pl-9 pr-10"
              />
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-charcoal transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
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
            <span>{loading ? 'Creating Account…' : 'Create Account'}</span>
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <p className="text-center text-xs text-taupe mt-8 pt-6 border-t border-border/70 font-sans">
          Already registered with Smita Couture?{' '}
          <Link
            to="/login"
            className="text-charcoal font-semibold underline underline-offset-4 hover:text-gold transition-colors"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
