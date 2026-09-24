import { useState } from 'react';
import toast from '../utils/toast';
import API_BASE from '../utils/api';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';

/** Lead capture + redirect-to-payment flow shared by the masterclass hub and menu pages. */
export default function useMasterclassRegistration(selectedClass) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setFormData({ ...formData, [name]: nextValue });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = getContactValidationError(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    const sanitizedPhone = normalizeIndianMobile(formData.phone);
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: sanitizedPhone,
          city: formData.city.trim(),
          type: 'Webinar',
          courseName: selectedClass.courseName,
          amount: 499,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setShowSuccessModal(true);
        toast.success('Seat reserved. Opening payment page...');
        const query = new URLSearchParams({
          leadId: data.leadId,
          name: data.name || formData.name.trim(),
          email: data.email || formData.email.trim(),
          phone: data.phone || sanitizedPhone,
          city: data.city || formData.city.trim(),
          amount: String(data.amount || '49900'),
          ref: data.leadId ? `DS-${String(data.leadId).slice(-6).toUpperCase()}` : `DS-${Date.now().toString().slice(-6)}`,
          courseName: data.courseName || selectedClass.courseName,
        });

        window.setTimeout(() => {
          window.location.assign(`/${selectedClass.paymentPage}?${query.toString()}`);
        }, 1200);
      } else {
        toast.error(data.error || data.message || 'Failed to initiate registration. Please try again.');
      }
    } catch (err) {
      toast.error(`Connection Error: Unable to reach server. ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    isModalOpen,
    openModal,
    closeModal,
    showSuccessModal,
  };
}
