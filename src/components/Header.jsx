import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConsultationModal from './ConsultationModal';
import SuccessModal from './SuccessModal';
import SiteNavbar from './SiteNavbar';
import API_BASE from '../utils/api';
import toast from '@/utils/toast';
import { handleRazorpayPayment } from '../utils/paymentUtils';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';
import { ONLINE_PAYMENT_ENABLED } from '../config/payments';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authState, setAuthState] = useState({
    isStudent: false,
    isAdmin: false,
    studentName: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consultationType: 'General Consultation',
    dob: '',
    tob: '',
    pob: '',
    message: '',
  });

  const handleConsultChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const readAuthState = () => ({
    isStudent: Boolean(localStorage.getItem('studentToken')),
    isAdmin: Boolean(localStorage.getItem('adminToken')),
    studentName: localStorage.getItem('studentName') || 'Student',
  });

  const syncAuthState = () => {
    setAuthState(readAuthState());
  };

  const handleStudentLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentName');
    syncAuthState();
    navigate('/login');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    syncAuthState();
    navigate('/admin/login');
  };

  const isLoginPage = location.pathname === '/login' || location.pathname === '/admin/login';

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    const validationError = getContactValidationError(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    const sanitizedPhone = normalizeIndianMobile(formData.phone);

    if (ONLINE_PAYMENT_ENABLED && formData.price) {
      const onSuccess = () => {
        setIsConsultModalOpen(false);
        setIsSuccessOpen(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          consultationType: 'General Consultation',
          dob: '',
          tob: '',
          pob: '',
          message: '',
          price: '',
        });
        setIsSubmitting(false);
      };

      const success = await handleRazorpayPayment(
        {
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: sanitizedPhone,
        },
        onSuccess,
      );
      if (!success) {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: sanitizedPhone,
          type: 'Consultation',
          courseName: formData.consultationType,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setIsConsultModalOpen(false);
        setIsSuccessOpen(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          consultationType: 'General Consultation',
          dob: '',
          tob: '',
          pob: '',
          message: '',
        });
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch {
      toast.error('Network Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('focus', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('focus', syncAuthState);
    };
  }, [location.pathname]);

  return (
    <>
      <SiteNavbar
        authState={authState}
        isLoginPage={isLoginPage}
        onBookConsultation={() => setIsConsultModalOpen(true)}
        onStudentLogout={handleStudentLogout}
        onAdminLogout={handleAdminLogout}
      />

      {/*
        Legacy navbar (Bootstrap + custom CSS) — replaced by SiteNavbar.jsx
        Kept commented for reference during rollout.

      <style>{` ... `}</style>
      <div className="header-fixed-wrapper">...</div>
      <div className="mobile-backcanvas">...</div>
      */}

      <ConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        formData={formData}
        handleChange={handleConsultChange}
        handleSubmit={handleConsultSubmit}
        isSubmitting={isSubmitting}
        isFixedService={!!formData.consultationType}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Consultation Booked!"
        message="Your consultation request has been received. Our team will contact you shortly to confirm the schedule."
      />
    </>
  );
}

export default Header;
