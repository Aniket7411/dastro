import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from '@/utils/toast';
import {
  counsellorForgotPassword,
  counsellorLogin,
  counsellorResetPassword,
  setCounsellorSession,
} from '../../utils/freeConsultationApi';
import { isValidEmail, getPasswordValidationError } from '../../utils/validation';
import { BTN_PRIMARY, CARD, SHELL, WRAP, INPUT, LABEL } from '../../components/free-consultation/tokens';
import { SITE_LOGO, SITE_LOGO_ALT } from '../../utils/brandAssets';

const BTN_LINK =
  'border-0 bg-transparent p-0 text-xs font-bold text-site-accent-dark hover:text-site-primary';

export default function CounsellorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState('LOGIN');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('counsellorToken')) {
      navigate('/counsellor/desk', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await counsellorLogin(email.trim().toLowerCase(), password);
      setCounsellorSession(data.token, data.counsellor);
      toast.success(`Welcome, ${data.counsellor.name}`);
      navigate('/counsellor/desk', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordResetOtp = async () => {
    if (!isValidEmail(email)) {
      toast.error('Please enter your registered email address');
      return false;
    }

    setLoading(true);
    try {
      await counsellorForgotPassword(email);
      toast.success('Password reset email sent. Please check your inbox.');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to process request');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const sent = await requestPasswordResetOtp();
    if (sent) setViewState('RESET');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!otp.trim()) {
      toast.error('Please enter the 6-digit OTP from your email');
      return;
    }

    const passwordError = getPasswordValidationError(newPassword, confirmPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      await counsellorResetPassword(email, otp, newPassword);
      toast.success('Password reset successful! You can now sign in.');
      setViewState('LOGIN');
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Invalid OTP or expired');
    } finally {
      setLoading(false);
    }
  };

  const title = viewState === 'FORGOT'
    ? 'Forgot password'
    : viewState === 'RESET'
      ? 'Reset password'
      : 'Counsellor login';

  const subtitle = viewState === 'LOGIN'
    ? 'Free consultation lead desk'
    : viewState === 'FORGOT'
      ? 'Enter your registered email to receive an OTP'
      : 'Enter the OTP from your email and choose a new password';

  return (
    <div className={`${SHELL} tw-page flex min-h-screen items-center justify-center`}>
      <div className={`${WRAP} w-full max-w-md !py-8 sm:!py-10`}>
        <div className="mb-6 text-center sm:mb-8">
          <Link
            to="/"
            className="mx-auto mb-4 block w-fit transition-opacity hover:opacity-90"
            aria-label={`${SITE_LOGO_ALT} home`}
          >
            <img src={SITE_LOGO} alt={SITE_LOGO_ALT} className="h-12 w-12 rounded-xl object-contain" />
          </Link>
          <h1 className="font-body text-xl font-extrabold text-site-primary sm:text-2xl">{title}</h1>
          <p className="mt-2 font-body text-sm text-site-muted">{subtitle}</p>
        </div>

        {viewState === 'LOGIN' && (
          <form onSubmit={handleSubmit} className={`${CARD} flex flex-col gap-4 sm:gap-5`}>
            <div>
              <label htmlFor="counsellor-email" className={LABEL}>Email</label>
              <input
                id="counsellor-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className={INPUT}
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label htmlFor="counsellor-password" className={LABEL}>Password</label>
                <button
                  type="button"
                  className={BTN_LINK}
                  onClick={() => setViewState('FORGOT')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="counsellor-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={`${INPUT} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-site-muted transition hover:text-site-primary"
                >
                  {showPassword ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className={BTN_PRIMARY}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Sign in
            </button>
          </form>
        )}

        {viewState === 'FORGOT' && (
          <form onSubmit={handleForgotPassword} className={`${CARD} flex flex-col gap-4 sm:gap-5`}>
            <div>
              <label htmlFor="forgot-email" className={LABEL}>Email</label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className={INPUT}
              />
            </div>
            <button type="submit" disabled={loading} className={BTN_PRIMARY}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Send reset OTP
            </button>
            <button
              type="button"
              className="text-center text-sm font-semibold text-site-muted hover:text-site-primary"
              onClick={() => setViewState('LOGIN')}
            >
              Back to sign in
            </button>
          </form>
        )}

        {viewState === 'RESET' && (
          <form onSubmit={handleResetPassword} className={`${CARD} flex flex-col gap-4 sm:gap-5`}>
            <div>
              <label htmlFor="reset-email" className={LABEL}>Email</label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly
                className={`${INPUT} bg-[#faf6f1]`}
              />
            </div>
            <div>
              <label htmlFor="reset-otp" className={LABEL}>OTP from email</label>
              <input
                id="reset-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                className={INPUT}
                placeholder="6-digit code"
              />
            </div>
            <div>
              <label htmlFor="reset-new-password" className={LABEL}>New password</label>
              <input
                id="reset-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor="reset-confirm-password" className={LABEL}>Confirm password</label>
              <input
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className={INPUT}
              />
            </div>
            <button type="submit" disabled={loading} className={BTN_PRIMARY}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Reset password
            </button>
            <div className="flex flex-col gap-2 text-center text-sm">
              <button
                type="button"
                className="font-semibold text-site-accent-dark hover:text-site-primary"
                disabled={loading}
                onClick={requestPasswordResetOtp}
              >
                Resend OTP
              </button>
              <button
                type="button"
                className="font-semibold text-site-muted hover:text-site-primary"
                onClick={() => setViewState('LOGIN')}
              >
                Back to sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
