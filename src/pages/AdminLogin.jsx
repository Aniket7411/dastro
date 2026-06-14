import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { isValidEmail } from '../utils/validation';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        toast.success('Welcome back, Admin!');
        navigate('/admin');
      } else {
        const errorMsg = data.message || 'Invalid Credentials';
        setLoginError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Login Error:', error);
      const connError = 'Connection failed. Please try again.';
      setLoginError(connError);
      toast.error(connError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative box-border flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-5 font-body sm:px-8 sm:py-9 bg-[radial-gradient(circle_at_10%_8%,rgba(42,15,2,0.08),transparent_30%),radial-gradient(circle_at_92%_4%,rgba(200,131,42,0.1),transparent_28%),linear-gradient(135deg,#fdf6ee_0%,#f0e8dc_100%)]">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(42,15,2,0.12),transparent_70%)]"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-site-primary/10 bg-white shadow-[0_24px_64px_rgba(42,15,2,0.12)] min-[860px]:max-h-[calc(100vh-2.5rem)] min-[860px]:min-h-[34rem] min-[860px]:max-w-[920px] min-[860px]:flex-row"
      >
        <div className="flex flex-none flex-col overflow-y-auto border-b border-site-primary/[0.08] px-5 py-6 min-[860px]:flex-[0_0_46%] min-[860px]:basis-1/2 min-[860px]:border-b-0 min-[860px]:border-r min-[860px]:px-[1.85rem] min-[860px]:pb-6 min-[860px]:pt-7 lg:flex-[0_0_50%]">
          <button
            type="button"
            className="mb-5 inline-flex items-center gap-2 rounded-lg border border-site-primary/15 bg-[#fffbf5] px-3 py-2 text-[0.8125rem] font-bold text-site-muted transition hover:border-site-primary/30 hover:bg-site-bg hover:text-site-primary"
            onClick={() => navigate('/')}
          >
            <i className="fas fa-arrow-left" aria-hidden="true" />
            Back to Website
          </button>

          <div className="mb-[1.35rem] flex items-center gap-3">
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex h-9 w-9 items-center justify-center rounded-[0.625rem] bg-gradient-to-br from-site-primary to-site-accent-dark text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(42,15,2,0.28)]"
              aria-hidden="true"
            >
              A
            </motion.span>
            <p className="m-0 font-heading text-[1.15rem] font-bold text-site-primary">
              DS Astro <em className="not-italic text-site-accent">Institute</em>
            </p>
          </div>

          <span className="mb-2 inline-block text-[0.6875rem] font-extrabold uppercase tracking-[0.14em] text-site-primary">
            Admin Portal
          </span>
          <h1 className="mb-2 font-heading text-[clamp(1.65rem,3vw,2rem)] font-extrabold leading-[1.1] text-site-primary">
            Welcome Back
          </h1>
          <p className="mb-5 max-w-[22rem] text-sm leading-relaxed text-site-soft">
            Sign in to your administrative dashboard
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-site-muted" htmlFor="admin-email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <i className="fas fa-envelope pointer-events-none absolute left-3.5 text-[0.8125rem] text-site-soft" aria-hidden="true" />
                <input
                  id="admin-email"
                  type="email"
                  className="box-border min-h-11 w-full rounded-[0.625rem] border border-[#cbd5e1] bg-white py-2.5 pl-9 pr-9 text-sm text-site-primary outline-none focus:border-site-primary focus:ring-[3px] focus:ring-site-primary/10"
                  placeholder="admin@dsastroinstitute.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-site-muted" htmlFor="admin-password">
                Password
              </label>
              <div className="relative flex items-center">
                <i className="fas fa-lock pointer-events-none absolute left-3.5 text-[0.8125rem] text-site-soft" aria-hidden="true" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="box-border min-h-11 w-full rounded-[0.625rem] border border-[#cbd5e1] bg-white py-2.5 pl-9 pr-9 text-sm text-site-primary outline-none focus:border-site-primary focus:ring-[3px] focus:ring-site-primary/10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2.5 border-0 bg-transparent p-1 text-sm text-site-soft hover:text-site-primary"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-red-600/25 bg-red-100/50 px-3.5 py-2.5 text-[0.8125rem] text-red-700"
                  role="alert"
                >
                  <i className="fas fa-exclamation-circle" aria-hidden="true" />
                  <span>{loginError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer select-none items-center gap-2 text-[0.8125rem] font-semibold text-site-soft">
                <input type="checkbox" className="h-3.5 w-3.5 cursor-pointer accent-site-primary" />
                <span>Remember me</span>
              </label>
              <a
                href="#"
                className="text-[0.8125rem] font-bold text-site-primary no-underline hover:text-site-accent"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="mt-1 flex min-h-11 w-full items-center justify-center gap-2 rounded-[0.625rem] border-0 bg-gradient-to-br from-site-primary to-site-accent-dark px-5 py-2.5 text-[0.9375rem] font-extrabold text-white shadow-[0_14px_30px_rgba(42,15,2,0.22)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? (
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white"
                  aria-hidden="true"
                />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <ul className="mt-4 grid list-none grid-cols-1 gap-1.5 p-0 min-[860px]:grid-cols-3" aria-label="Admin portal features">
            <li className="flex min-h-8 items-center justify-start gap-1.5 rounded-[0.625rem] border border-[#e2e8f0] bg-[#f8fafc] px-1.5 py-2 text-center text-[0.6875rem] font-bold leading-tight text-site-muted min-[860px]:justify-center">
              <i className="fas fa-shield-alt text-xs text-site-primary" aria-hidden="true" />
              Secure access
            </li>
            <li className="flex min-h-8 items-center justify-start gap-1.5 rounded-[0.625rem] border border-[#e2e8f0] bg-[#f8fafc] px-1.5 py-2 text-center text-[0.6875rem] font-bold leading-tight text-site-muted min-[860px]:justify-center">
              <i className="fas fa-chart-line text-xs text-site-primary" aria-hidden="true" />
              Analytics
            </li>
            <li className="flex min-h-8 items-center justify-start gap-1.5 rounded-[0.625rem] border border-[#e2e8f0] bg-[#f8fafc] px-1.5 py-2 text-center text-[0.6875rem] font-bold leading-tight text-site-muted min-[860px]:justify-center">
              <i className="fas fa-users-cog text-xs text-site-primary" aria-hidden="true" />
              Manage users
            </li>
          </ul>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-site-primary/[0.08] pt-5 text-xs text-site-soft">
            <span>&copy; 2026 DS Astro Institute</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-xs font-semibold text-site-soft transition hover:text-site-primary"
                onClick={() => navigate('/privacy-policy')}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-xs font-semibold text-site-soft transition hover:text-site-primary"
                onClick={() => navigate('/terms-and-conditions')}
              >
                Terms
              </button>
            </div>
          </div>
        </div>

        <div className="relative hidden min-[860px]:block min-[860px]:flex-1 overflow-hidden bg-gradient-to-br from-site-primary to-site-accent-dark" aria-hidden="true">
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(42,15,2,0.82)_0%,rgba(42,15,2,0.08)_48%,rgba(42,15,2,0.78)_100%),linear-gradient(90deg,rgba(42,15,2,0.55)_0%,transparent_46%)]" />
          <div className="relative h-full w-full min-h-full">
            <div className="pointer-events-none absolute right-[8%] top-[10%] h-48 w-48 rounded-full bg-site-accent/35 blur-[40px]" />
            <div className="pointer-events-none absolute bottom-[18%] left-[12%] h-36 w-36 rounded-full bg-site-accent/25 blur-[40px]" />

            <div className="absolute left-7 right-7 top-7 z-[2] text-slate-100">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#f5c98d]">
                Administration
              </span>
              <span className="block max-w-[18rem] font-heading text-2xl font-bold leading-[1.15] text-[#f8fafc]">
                Manage courses, students &amp; content
              </span>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative z-0 h-full w-full"
            >
              <img src="/owl_login.png" alt="" className="block h-full min-h-[22rem] w-full object-cover" />
            </motion.div>

            <span className="absolute bottom-7 left-7 z-[2] inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2.5 text-[0.8125rem] font-extrabold text-[#f8fafc] backdrop-blur-[14px]">
              <i className="fas fa-lock" aria-hidden="true" />
              Authorized personnel only
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
