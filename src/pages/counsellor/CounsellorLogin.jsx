import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from '@/utils/toast';
import { counsellorLogin, setCounsellorSession } from '../../utils/freeConsultationApi';
import { BTN_PRIMARY, CARD, SHELL, WRAP, INPUT, LABEL } from '../../components/free-consultation/tokens';
import { SITE_LOGO, SITE_LOGO_ALT } from '../../utils/brandAssets';

export default function CounsellorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('counsellorToken')) {
      navigate('/counsellor/desk', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className={`${SHELL} tw-page flex min-h-screen items-center justify-center`}>
      <div className={`${WRAP} w-full max-w-md !py-8 sm:!py-10`}>
        <div className="mb-6 text-center sm:mb-8">
          <img src={SITE_LOGO} alt={SITE_LOGO_ALT} className="mx-auto mb-4 h-12 w-12 rounded-xl object-contain" />
          <h1 className="font-body text-xl font-extrabold text-site-primary sm:text-2xl">Counsellor login</h1>
          <p className="mt-2 font-body text-sm text-site-muted">Free consultation lead desk</p>
        </div>

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
            <label htmlFor="counsellor-password" className={LABEL}>Password</label>
            <input
              id="counsellor-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={INPUT}
            />
          </div>
          <button type="submit" disabled={loading} className={BTN_PRIMARY}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
