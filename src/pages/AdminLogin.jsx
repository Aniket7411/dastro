import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { isValidEmail } from '../utils/validation';
import LoginBrandMark, { LOGIN_CARD_CLASS, LOGIN_PAGE_WRAP, LOGIN_PANEL_CLASS } from '../components/LoginBrandMark';

const adminInputClass =
  'box-border min-h-11 w-full rounded-[0.625rem] border border-[#ead8c6] bg-white py-2.5 pl-9 pr-9 text-sm text-site-primary outline-none focus:border-site-accent focus:ring-[3px] focus:ring-site-accent/20';

const adminSubmitClass =
  'flex min-h-11 w-full items-center justify-center gap-2 rounded-[0.625rem] border-0 bg-gradient-to-br from-site-primary to-site-accent-dark px-5 py-2.5 text-[0.9375rem] font-extrabold text-white shadow-[0_14px_30px_rgba(139,74,30,0.22)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70';

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
    <div className={LOGIN_PAGE_WRAP}>
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(42,15,2,0.12),transparent_70%)]"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={LOGIN_CARD_CLASS}
      >
        <div className={LOGIN_PANEL_CLASS}>
          <div className="mb-8">
            <LoginBrandMark badge="Admin Portal" />
            <h1 className="mt-3 font-heading text-[1.65rem] font-bold leading-tight text-site-primary">
              Welcome back, Admin!
            </h1>
            <p className="mt-1.5 text-sm text-site-muted">
              Securely sign in to manage the platform.
            </p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleLogin} aria-label="Admin sign in">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-site-muted" htmlFor="admin-email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <i className="fas fa-envelope pointer-events-none absolute left-3.5 text-[0.8125rem] text-[#b58b66]" aria-hidden="true" />
                <input
                  id="admin-email"
                  type="email"
                  className={adminInputClass}
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
                <i className="fas fa-lock pointer-events-none absolute left-3.5 text-[0.8125rem] text-[#b58b66]" aria-hidden="true" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className={adminInputClass}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2.5 border-0 bg-transparent p-1 text-sm text-[#b58b66] hover:text-site-accent"
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

            <button type="submit" className={adminSubmitClass} disabled={isLoading}>
              {isLoading ? (
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white"
                  aria-hidden="true"
                />
              ) : (
                'Sign in'
              )}
            </button>
          </form>
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
