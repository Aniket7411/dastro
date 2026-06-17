import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import API_BASE from '../utils/api';
import toast from '@/utils/toast';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';
import { ONLINE_PAYMENT_ENABLED } from '../config/payments';

const highlights = [
  { num: '40+', label: 'Hours Content', icon: '⏱️' },
  { num: '12', label: 'Weeks Duration', icon: '📅' },
  { num: '2K+', label: 'Students', icon: '👥' },
  { num: '4.8', label: 'Rating', icon: '⭐' },
];

const courseSteps = [
  { icon: '📊', title: 'Chart Mastery', desc: 'Advanced chart patterns' },
  { icon: '📂', title: 'Divisionals', desc: 'Varga charts deep dive' },
  { icon: '⚖️', title: 'Shadbala', desc: 'Planetary strengths' },
  { icon: '🔥', title: 'Special Lagnas', desc: 'Advanced techniques' },
  { icon: '🌑', title: 'Rahu-Ketu', desc: 'Nodes mastery' },
  { icon: '💎', title: 'Remedies', desc: 'Practical solutions' },
];

const stepDetails = [
  "Master complex chart patterns and learn to identify subtle yogas and combinations that reveal deep insights about a person's life path and potential.",
  'Explore Navamsa, Dasamsa, Dwadasamsa and other divisional charts that provide detailed insights into marriage, career, and spiritual matters.',
  'Understand Shadbala - the six sources of planetary strength. Learn to calculate and interpret planetary powers for accurate predictions.',
  'Master special ascendants like Bhava Lagna, Hora Lagna, and Ghatika Lagna used in specific predictive techniques and timing methods.',
  'Deep dive into Rahu and Ketu - the shadow planets. Understand their karmic significance, dasha effects, and remedies for nodal afflictions.',
  'Learn practical remedial measures including gemstone recommendations, mantras, rituals, and lifestyle modifications to strengthen weak planets.',
];

const features = [
  { icon: 'video', title: 'Expert Sessions', desc: '30-35 intensive live classes with Guru Ji' },
  { icon: 'book-open', title: 'Case Studies', desc: 'Real chart analysis and practical templates' },
  { icon: 'infinity', title: 'Elite Access', desc: 'Lifetime access to all masterclass recordings' },
  { icon: 'certificate', title: 'Pro Certificate', desc: 'Industry-recognized expert certification' },
  { icon: 'users', title: 'Mastermind Group', desc: 'Collaborate with advanced practitioners' },
  { icon: 'headset', title: 'Direct Mentorship', desc: 'Get your complex doubts cleared instantly' },
];

const reviews = [
  { name: 'Vikram Mehta', rating: 5, text: 'This advanced course opened new dimensions in my astrological practice. Highly recommended!', avatar: '/images/10350949.png' },
  { name: 'Sneha Rao', rating: 5, text: 'The divisional charts section alone is worth the entire course fee. Excellent teaching.', avatar: '/images/10350961.png' },
  { name: 'Arjun Nair', rating: 4, text: 'Great advanced content. Assumes you know basics well. Very practical approach.', avatar: '/images/10350969.png' },
];

const faqs = [
  { q: 'Do I need to know basic astrology?', a: 'Yes, this course requires foundation knowledge of signs, planets, and houses.' },
  { q: 'How is this different from basic courses?', a: 'We focus on divisional charts, advanced dashas, and complex yogas not covered in basics.' },
  { q: 'Will I be able to predict after this?', a: 'Yes, you will learn professional-level predictive techniques.' },
];

function AdvancedAstrology() {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    experience: 'intermediate',
  });

  const { hash } = useLocation();

  useEffect(() => {
    if (window.AOS) window.AOS.refresh();
  }, []);

  useEffect(() => {
    if (!hash) return;
    const element = document.getElementById(hash.replace('#', ''));
    if (element) {
      setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [hash]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = getContactValidationError(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    if (ONLINE_PAYMENT_ENABLED) {
      toast('Payment gateway will open here once live keys are configured.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: normalizeIndianMobile(formData.phone),
          type: 'Course',
          leadType: 'LIVE COURSE LEAD',
          status: 'ENQUIRY RECEIVED',
          paymentStatus: 'NOT REQUIRED',
          courseName: 'Advanced Predictive Astrology',
          experience: formData.experience,
          city: formData.city,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Enquiry received! We will call you within 24 hours.');
        setShowModal(false);
        setFormData({ name: '', email: '', phone: '', city: '', experience: 'intermediate' });
      } else {
        toast.error(data.message || 'Could not submit enquiry.');
      }
    } catch {
      toast.error('Could not submit enquiry. Please try again.');
    }
  };

  return (
    <div className="w-full overflow-x-clip bg-[#fdf6ee] font-body text-[#3d1a08]">
      <SEO
        title="Advanced Predictive Astrology Course"
        description="Master divisional charts, Shadbala, Rahu-Ketu analysis, and professional predictive techniques with DS Astrology."
        url="/advanced-astrology"
      />

      {/* Hero */}
      <section className="relative border-b border-[#8b4a1e]/10 bg-gradient-to-b from-[#fdf6ee] to-[#fffbf5] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-[#c8832a]/10 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div data-aos="fade-right">
            <span className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#c8832a]/15 bg-[#fffbf5] px-4 py-2 text-sm font-bold text-[#8b4a1e] shadow-sm">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" aria-hidden="true" />
              Advanced Level Mastery
            </span>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-[#2a0f02] sm:text-5xl">
              Master{' '}
              <span className="bg-gradient-to-br from-[#8b4a1e] to-[#c8832a] bg-clip-text text-transparent">
                Advanced Predictive
              </span>{' '}
              Astrology
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#714626] sm:text-lg">
              Take your knowledge to professional heights. Explore divisional charts,
              planetary strengths (Shadbala), and advanced karmic analysis of Rahu-Ketu.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {highlights.map((h) => (
                <div key={h.label} className="flex items-center gap-3 rounded-xl border border-[#c8832a]/10 bg-[#fffbf5] p-3 shadow-sm">
                  <span className="text-xl" aria-hidden="true">{h.icon}</span>
                  <div>
                    <p className="text-lg font-extrabold text-[#8b4a1e]">{h.num}</p>
                    <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[#9b6640]">{h.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="rounded-xl bg-[#2a0f02] px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-black"
              >
                {ONLINE_PAYMENT_ENABLED ? 'Enroll Now for ₹999' : 'Request callback — ₹999'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#8b4a1e] px-6 py-3 text-sm font-extrabold text-[#8b4a1e] transition hover:bg-[#8b4a1e] hover:text-white"
              >
                <i className="fas fa-play" aria-hidden="true" />
                Watch Preview
              </button>
            </div>
          </div>

          <div className="relative p-4" data-aos="zoom-in">
            <img
              src="/images/horocurty.jpg"
              alt="Advanced astrology study"
              className="h-[clamp(18rem,45vw,34rem)] w-full rounded-3xl border-4 border-white object-cover shadow-2xl"
            />
            <div className="absolute -right-2 -top-2 flex flex-col items-center gap-1 rounded-2xl border border-[#c8832a]/15 bg-[#fffbf5] px-4 py-3 text-xs font-bold text-[#2a0f02] shadow-lg animate-[bounce_4s_ease-in-out_infinite]">
              <span aria-hidden="true">🪐</span>
              <span>Expert Techniques</span>
            </div>
            <div className="absolute -bottom-2 -left-2 flex flex-col items-center gap-1 rounded-2xl border border-[#c8832a]/15 bg-[#fffbf5] px-4 py-3 text-xs font-bold text-[#2a0f02] shadow-lg animate-[bounce_4s_ease-in-out_infinite_2s]">
              <span aria-hidden="true">📜</span>
              <span>Pro Certification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Learning path */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-extrabold text-[#2a0f02] sm:text-4xl">Professional Learning Path</h2>
            <p className="mt-2 text-base text-[#9b6640] sm:text-lg">6 intensive modules for deep astrological expertise</p>
          </div>

          <div className="mt-8 flex gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-wrap lg:justify-between lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
            {courseSteps.map((step, idx) => (
              <button
                key={step.title}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`min-w-[8.75rem] flex-1 text-center transition ${currentStep === idx ? 'scale-105' : ''}`}
              >
                <div
                  className={`relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 transition ${
                    currentStep === idx
                      ? 'border-[#8b4a1e] bg-gradient-to-br from-[#8b4a1e] to-[#c8832a] text-white shadow-lg'
                      : 'border-[#c8832a]/20 bg-[#fffbf5] text-[#2a0f02]'
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">{step.icon}</span>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2a0f02] text-[0.625rem] font-extrabold text-white">
                    {idx + 1}
                  </span>
                </div>
                <p className="font-heading text-sm font-bold text-[#2a0f02]">{step.title}</p>
                <p className="mt-1 hidden text-xs text-[#6b6b8a] lg:block">{step.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#c8832a]/15 bg-[#fffbf5] shadow-lg" data-aos="fade-up">
            <div className="grid md:grid-cols-[5rem_1fr]">
              <div className="flex items-center justify-center bg-gradient-to-br from-[#8b4a1e] to-[#c8832a] p-5">
                <span className="font-heading text-6xl font-extrabold text-white/25">{currentStep + 1}</span>
              </div>
              <div className="p-5 sm:p-8">
                <h3 className="font-heading text-xl font-extrabold sm:text-2xl">
                  <span className="bg-gradient-to-br from-[#8b4a1e] to-[#c8832a] bg-clip-text text-transparent">
                    Stage {currentStep + 1}: {courseSteps[currentStep].title}
                  </span>
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#5c3d26]">{stepDetails[currentStep]}</p>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="mt-4 inline-flex items-center gap-2 bg-gradient-to-br from-[#8b4a1e] to-[#c8832a] bg-clip-text text-sm font-extrabold text-transparent"
                >
                  Master this module
                  <i className="fas fa-arrow-right" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#fdf6ee] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="h-full rounded-2xl border border-[#c8832a]/10 bg-[#fffbf5] p-7 shadow-sm transition hover:-translate-y-2 hover:border-[#c8832a] hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#c8832a]/10 text-xl text-[#8b4a1e]">
                <i className={`fas fa-${f.icon}`} aria-hidden="true" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#2a0f02]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#714626]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1" data-aos="fade-right">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#8b4a1e]">Master Instructor</span>
            <h2 className="mt-2 font-heading text-4xl font-extrabold text-[#2a0f02]">Guru Devanand Ji</h2>
            <p className="mt-4 text-base leading-relaxed text-[#9b6640] sm:text-lg">
              Spiritual master with 20+ years of deep Vedic practice. Specializes in
              advanced divisional charts, Rahu-Ketu analysis, and spiritual astrology.
              Guide to 5,000+ students worldwide.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              {[
                { val: '5k+', label: 'Students' },
                { val: '20+', label: 'Years Exp' },
                { val: '4.9/5', label: 'Rating' },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-6">
                  {i > 0 && <span className="hidden h-10 w-px bg-[#8b4a1e]/15 sm:block" aria-hidden="true" />}
                  <div className="text-center">
                    <p className="bg-gradient-to-br from-[#8b4a1e] to-[#c8832a] bg-clip-text text-2xl font-extrabold text-transparent">{s.val}</p>
                    <p className="text-sm text-[#9b6640]">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative order-1 flex justify-center lg:order-2" data-aos="fade-left">
            <div className="absolute h-[110%] w-[110%] rounded-full bg-[#c8832a]/15 blur-2xl" aria-hidden="true" />
            <img
              src="/images/spiritual-man-india-traditional-clothing-39495501.jpg"
              alt="Guru Devanand Ji"
              className="relative z-10 h-64 w-64 rounded-full border-[10px] border-white object-cover shadow-xl sm:h-80 sm:w-80 lg:h-96 lg:w-96"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-[#8b4a1e] to-[#c8832a] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-[#fff7ed] sm:text-4xl">Master Students&apos; Experiences</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
            {reviews.map((r, i) => (
              <article
                key={r.name}
                className="rounded-2xl border border-white/30 bg-white/15 p-6 text-left text-[#fff7ed] backdrop-blur-md"
                data-aos="zoom-in"
                data-aos-delay={i * 100}
              >
                <img src={r.avatar} alt={r.name} className="mb-4 h-14 w-14 rounded-full border-2 border-white object-cover" />
                <p className="mb-3 italic leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <p className="font-extrabold">{r.name}</p>
                <p className="mt-1 tracking-widest text-[#f5c98d]" aria-label={`${r.rating} out of 5 stars`}>
                  {'★'.repeat(r.rating)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16" id="enroll">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-[#c8832a]/15 bg-[#fffbf5] p-8 text-center shadow-xl sm:p-10" data-aos="flip-up">
            <h2 className="font-heading text-3xl font-extrabold text-[#2a0f02] sm:text-4xl">Achieve Professional Mastery</h2>
            <p className="mt-2 text-base text-[#714626] sm:text-lg">Limited seats available for the advanced batch</p>
            <div className="mt-4 flex items-baseline justify-center gap-2">
              <span className="text-xl text-[#9b6640] line-through">₹5100</span>
              <span className="font-price text-4xl font-bold tabular-nums tracking-tight bg-gradient-to-br from-[#8b4a1e] to-[#c8832a] bg-clip-text text-transparent sm:text-5xl">
                ₹999
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-6 rounded-xl bg-[#2a0f02] px-8 py-3.5 text-base font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-black"
            >
              Secure Your Spot
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#fdf6ee] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-extrabold text-[#2a0f02]">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="overflow-hidden rounded-xl border border-[#8b4a1e]/10 bg-white shadow-sm">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-extrabold text-[#2a0f02] [&::-webkit-details-marker]:hidden">
                  {f.q}
                </summary>
                <p className="border-t border-[#8b4a1e]/10 px-4 py-3 text-sm leading-relaxed text-[#5c3d26]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-[#c8832a]/20 bg-[#fffbf5]"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="aa-enroll-title"
            >
              <div className="flex items-center justify-between border-b border-[#c8832a]/15 bg-[#fdf6ee] px-5 py-4">
                <h3 id="aa-enroll-title" className="font-heading text-xl font-extrabold text-[#2a0f02]">
                  Advanced Course Enrollment
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="text-2xl leading-none text-[#5c3d26]" aria-label="Close">
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 p-5">
                {[
                  { id: 'aa-name', label: 'Full Name', name: 'name', type: 'text' },
                  { id: 'aa-email', label: 'Email', name: 'email', type: 'email' },
                  { id: 'aa-phone', label: 'Phone', name: 'phone', type: 'tel' },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="mb-1 block text-sm font-bold text-[#5c3d26]">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-[#c8832a]/20 bg-white px-3 py-2.5 text-[#3d1a08] outline-none focus:border-[#8b4a1e] focus:ring-4 focus:ring-[#8b4a1e]/10"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="aa-experience" className="mb-1 block text-sm font-bold text-[#5c3d26]">
                    Experience Level
                  </label>
                  <select
                    id="aa-experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-[#c8832a]/20 bg-white px-3 py-2.5 text-[#3d1a08] outline-none focus:border-[#8b4a1e] focus:ring-4 focus:ring-[#8b4a1e]/10"
                  >
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Professional</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#2a0f02] py-3 text-sm font-extrabold text-white transition hover:bg-black"
                >
                  {ONLINE_PAYMENT_ENABLED ? 'Proceed to Payment (₹999)' : 'Request callback (₹999)'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdvancedAstrology;
