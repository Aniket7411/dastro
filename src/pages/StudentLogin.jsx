import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { isValidEmail, getPasswordValidationError } from '../utils/validation';
import LoginBrandMark, { LOGIN_CARD_CLASS, LOGIN_PAGE_WRAP, LOGIN_PANEL_CLASS } from '../components/LoginBrandMark';

const inputClass =
  'box-border min-h-11 w-full rounded-[0.625rem] border border-[#ead8c6] bg-white py-2.5 pl-9 pr-9 text-sm text-site-primary outline-none focus:border-site-accent focus:ring-[3px] focus:ring-site-accent/20';

const submitClass =
  'flex min-h-11 w-full items-center justify-center gap-2 rounded-[0.625rem] border-0 bg-gradient-to-br from-site-primary to-site-accent-dark px-5 py-2.5 text-[0.9375rem] font-extrabold text-white shadow-[0_14px_30px_rgba(139,74,30,0.22)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70';

const submitSecondaryClass =
  'flex min-h-11 w-full flex-1 items-center justify-center gap-2 rounded-[0.625rem] border border-site-accent/20 bg-[#fff7ed] px-5 py-2.5 text-[0.9375rem] font-extrabold text-[#6b3514] shadow-none transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70';

function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [viewState, setViewState] = useState('LOGIN');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (token) navigate('/dashboard');
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
      const response = await fetch(`${API_BASE}/api/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();
      const user = data.user || data.student || {};

      if (data.success) {
        localStorage.setItem('studentToken', data.token);
        localStorage.setItem('studentName', user.name || user.email || 'Student');
        toast.success('Welcome to your learning portal!');
        navigate('/dashboard');
      } else {
        const errorMsg = data.message || 'Invalid credentials';
        setLoginError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const connError = 'Connection failed. Please try again.';
      setLoginError(connError);
      toast.error(connError);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordResetOtp = async () => {
    if (!isValidEmail(email)) {
      toast.error('Please enter your registered email address');
      return false;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch(`${API_BASE}/api/student/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('OTP sent to your email (if registered)');
        return true;
      }

      toast.error(data.message || 'Failed to process request');
      return false;
    } catch {
      toast.error('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const sent = await requestPasswordResetOtp();
    if (sent) setViewState('RESET');
  };

  const handleResendOtp = async () => {
    await requestPasswordResetOtp();
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!otp) {
      toast.error('Please enter the 6-digit OTP from your email');
      return;
    }

    const passwordError = getPasswordValidationError(newPassword, confirmPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/student/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim(), newPassword }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Password reset successful! You can now login.');
        setViewState('LOGIN');
        setPassword('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Invalid OTP or expired');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordField = (value, onChange, id, label = 'Password') => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-site-muted" htmlFor={id}>
          {label}
        </label>
        {viewState === 'LOGIN' ? (
          <button
            type="button"
            className="border-0 bg-transparent p-0 text-xs font-bold text-site-accent-dark hover:text-site-primary"
            onClick={() => {
              setViewState('FORGOT');
              setLoginError('');
            }}
          >
            Forgot password?
          </button>
        ) : null}
      </div>
      <div className="relative flex items-center">
        <i className="fas fa-lock pointer-events-none absolute left-3.5 text-[0.8125rem] text-[#b58b66]" aria-hidden="true" />
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={inputClass}
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          required
        />
        <button
          type="button"
          className="absolute right-2.5 border-0 bg-transparent p-1 text-sm text-[#b58b66] hover:text-site-accent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label="Toggle password"
        >
          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
        </button>
      </div>
    </div>
  );

  const spinner = (
    <span
      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white"
      aria-hidden="true"
    />
  );

  return (
    <div className={LOGIN_PAGE_WRAP}>
      <span
        className="pointer-events-none absolute -right-16 -top-16 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(200,131,42,0.18),transparent_70%)]"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className={LOGIN_CARD_CLASS}
      >
        <div className={LOGIN_PANEL_CLASS}>
          {viewState === 'LOGIN' && (
            <>
              <div className="mb-8">
                <LoginBrandMark badge="Student Portal" />
                <h1 className="mt-3 font-heading text-[1.65rem] font-bold leading-tight text-site-primary">
                  Welcome back!
                </h1>
                <p className="mt-1.5 text-sm text-site-muted">
                  Sign in to access your guided lessons and materials.
                </p>
              </div>
              <form className="flex flex-col gap-4" onSubmit={handleLogin} aria-label="Student sign in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-site-muted" htmlFor="login-email">
                    Email address
                  </label>
                  <div className="relative flex items-center">
                    <i className="fas fa-envelope pointer-events-none absolute left-3.5 text-[0.8125rem] text-[#b58b66]" aria-hidden="true" />
                    <input
                      id="login-email"
                      type="email"
                      className={inputClass}
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {renderPasswordField(password, (e) => setPassword(e.target.value), 'login-password')}

                <AnimatePresence>
                  {loginError ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 rounded-lg border border-red-600/25 bg-red-100/50 px-3.5 py-2.5 text-[0.8125rem] text-red-700"
                    >
                      <i className="fas fa-exclamation-circle" aria-hidden="true" />
                      <span>{loginError}</span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <button type="submit" className={submitClass} disabled={isLoading}>
                  {isLoading ? (
                    spinner
                  ) : (
                    <>
                      Sign in
                      <i className="fas fa-arrow-right" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {viewState === 'FORGOT' && (
            <>
              <div className="mb-6">
                <LoginBrandMark badge="Recovery" />
                <h1 className="mt-3 font-heading text-xl font-bold text-site-primary sm:text-2xl">
                  Reset password
                </h1>
                <p className="mt-1 text-sm text-site-muted">
                  Enter your registered email to receive an OTP.
                </p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-site-muted" htmlFor="forgot-email">
                    Registered email
                  </label>
                  <div className="relative flex items-center">
                    <i className="fas fa-envelope pointer-events-none absolute left-3.5 text-[0.8125rem] text-[#b58b66]" aria-hidden="true" />
                    <input
                      id="forgot-email"
                      type="email"
                      className={inputClass}
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    className={submitSecondaryClass}
                    onClick={() => setViewState('LOGIN')}
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  <button type="submit" className={`${submitClass} mt-0 flex-1`} disabled={isLoading}>
                    {isLoading ? spinner : 'Send OTP'}
                  </button>
                </div>
              </form>
            </>
          )}

          {viewState === 'RESET' && (
            <>
              <div className="mb-6">
                <LoginBrandMark badge="Secure Reset" />
                <h1 className="mt-3 font-heading text-xl font-bold text-site-primary sm:text-2xl">
                  Set new password
                </h1>
                <p className="mt-1 text-sm text-site-muted">
                  Enter the 6-digit OTP sent to{' '}
                  <span className="font-semibold text-site-primary">{email}</span>
                </p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-site-muted" htmlFor="reset-otp">
                    6-digit OTP
                  </label>
                  <div className="relative flex items-center">
                    <i className="fas fa-key pointer-events-none absolute left-3.5 text-[0.8125rem] text-[#b58b66]" aria-hidden="true" />
                    <input
                      id="reset-otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className={inputClass}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    className="self-start border-0 bg-transparent p-0 text-xs font-bold text-site-accent-dark hover:text-site-primary disabled:opacity-60"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                </div>

                {renderPasswordField(newPassword, (e) => setNewPassword(e.target.value), 'reset-password', 'New password')}
                {renderPasswordField(
                  confirmPassword,
                  (e) => setConfirmPassword(e.target.value),
                  'reset-confirm-password',
                  'Confirm password',
                )}

                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    className={submitSecondaryClass}
                    onClick={() => {
                      setViewState('LOGIN');
                      setOtp('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={`${submitClass} mt-0 flex-1`} disabled={isLoading}>
                    {isLoading ? spinner : 'Reset password'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <div className="relative hidden min-[860px]:block min-[860px]:flex-1 overflow-hidden bg-gradient-to-br from-site-primary to-[#6b3514]" aria-hidden="true">
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(42,15,2,0.78)_0%,rgba(42,15,2,0.08)_48%,rgba(42,15,2,0.72)_100%),linear-gradient(90deg,rgba(42,15,2,0.6)_0%,transparent_46%)]" />
          <div className="relative h-full w-full min-h-full">
            <div className="absolute left-7 right-7 top-7 z-[2] text-[#fff7ed]">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#f5c98d]">
                Live course portal
              </span>
              <strong className="block max-w-[18rem] font-heading text-2xl font-bold leading-[1.15] text-[#fff7ed]">
                Learn with guided lessons and protected class videos.
              </strong>
            </div>
            <img
              src="/images/student_login_visual.png"
              alt=""
              className="block h-full min-h-[22rem] w-full object-cover"
            />
            <span className="absolute bottom-7 left-7 z-[2] inline-flex items-center gap-2 rounded-full border border-[#fff7ed]/20 bg-[#fff7ed]/15 px-3.5 py-2.5 text-[0.8125rem] font-extrabold text-[#fff7ed] backdrop-blur-[14px]">
              <i className="fas fa-graduation-cap" aria-hidden="true" />
              Enrolled student area
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default StudentLogin;
