import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  User,
} from 'lucide-react';
import API_BASE from '../utils/api';
import toast from '@/utils/toast';
import SEO from '../components/SEO';
import { fetchCourseBySlugOrId, mapCourseFromApi } from '../hooks/useCourses';
import PageLoader, { OverlayLoader } from '../components/PageLoader';
import {
  CheckoutModal,
  EnquiryModal,
  CouponControls,
} from '../components/CourseDetailModals';
import { BTN, TYPE } from '../components/consultation/tokens';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';
import { reportPaymentFailure, buildPaymentSuccessPath } from '../utils/paymentUtils';
import CourseTimer from '../components/CourseTimer';

const RECORDED_PAYMENT_ENABLED = true;
const PAGE_WRAP = 'mx-auto w-full max-w-[var(--container-public)] px-[var(--page-pad-x)]';
const PAGE = 'min-h-screen w-full bg-site-bg font-body text-site-text antialiased';

function MetaChip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-site-accent-dark/12 bg-site-bg px-2 py-0.5 font-body text-[0.6875rem] font-semibold text-site-muted sm:px-2.5 sm:py-1 sm:text-xs">
      {children}
    </span>
  );
}

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="border-t border-site-accent-dark/8 pt-5 first:border-t-0 first:pt-0 sm:pt-6">
      <h2 className={`${TYPE.h2} !mb-3 !text-base sm:!text-lg`}>{title}</h2>
      {children}
    </section>
  );
}

function mapDetailCourse(dbCourse) {
  const courseType = dbCourse.courseType || 'Recorded';
  const instructorName =
    typeof dbCourse.instructor === 'string' ? dbCourse.instructor : dbCourse.instructor?.name || '';

  return {
    ...mapCourseFromApi(dbCourse),
    shortDesc: dbCourse.description || '',
    longDesc: dbCourse.longDesc || dbCourse.description || '',
    schedule:
      courseType === 'Recorded'
        ? 'Self-paced'
        : dbCourse.batchDetails?.startDate
          ? `Starts ${dbCourse.batchDetails.startDate}`
          : 'Upcoming batch',
    instructor: instructorName,
    instructorBio: typeof dbCourse.instructor === 'object' ? dbCourse.instructor?.bio || '' : '',
    instructorImage: typeof dbCourse.instructor === 'object' ? dbCourse.instructor?.image || '' : '',
    topics: dbCourse.learningOutcomes?.length ? dbCourse.learningOutcomes : dbCourse.topics || [],
    curriculum: dbCourse.curriculum || [],
    batchDetails: dbCourse.batchDetails || null,
    faqs: dbCourse.faqs || [],
    testimonials: dbCourse.testimonials || [],
  };
}

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    age: '',
    interest: '',
    message: '',
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const isLiveCourse = course?.courseType === 'Live';
  const isRecordedCourse = course?.courseType === 'Recorded';
  const canPayOnline =
    RECORDED_PAYMENT_ENABLED && isRecordedCourse && paymentEnabled && Number(course?.price) > 0;
  const hasAvailableCoupons = availableCoupons.length > 0;
  const listPath = isLiveCourse ? '/live-courses' : '/recorded-courses';

  useEffect(() => {
    if (!RECORDED_PAYMENT_ENABLED) return;
    fetch(`${API_BASE}/api/payment/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPaymentEnabled(!!data.paymentEnabled);
      })
      .catch(() => setPaymentEnabled(false));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadCourse = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseBySlugOrId(courseId);
        setCourse(mapDetailCourse(data.course));
      } catch (err) {
        toast.error(err.message || 'Course not found');
        navigate('/recorded-courses');
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId, navigate]);

  useEffect(() => {
    if (!course?.id || !isRecordedCourse || !paymentEnabled) {
      setAvailableCoupons([]);
      return;
    }
    fetch(`${API_BASE}/api/coupons/available/${course.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.coupons)) setAvailableCoupons(data.coupons);
      })
      .catch(() => setAvailableCoupons([]));
  }, [course?.id, isRecordedCourse, paymentEnabled]);

  const getCoursePrice = () => Number(course?.price) || 0;
  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    const price = getCoursePrice();
    const discountValue = Number(appliedCoupon.discountValue) || 0;
    const discount =
      appliedCoupon.discountType === 'fixed'
        ? discountValue
        : Math.round((price * discountValue) / 100);
    return Math.max(0, Math.min(discount, price));
  };
  const getPayableAmount = () => Math.max(getCoursePrice() - getDiscountAmount(), 1);

  const openCheckoutModal = async () => {
    const token = localStorage.getItem('studentToken');
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const profile = data.profile || data.user || data.student;
        if (profile) {
          setFormData({
            name: profile.name || '',
            email: profile.email || '',
            phone: (profile.mobile || profile.phone || '').replace(/\D/g, '').slice(0, 10),
          });
        }
      } catch {
        /* guest checkout */
      }
    }
    setShowCheckoutModal(true);
    if (hasAvailableCoupons && !appliedCoupon) {
      toast('Apply a coupon code before checkout if you have one.', { icon: '🏷️', duration: 4000 });
    }
  };

  const openEnquiryModal = () => setShowEnquiryModal(true);
  const initiateCheckout = () => {
    if (!RECORDED_PAYMENT_ENABLED || !canPayOnline) {
      openEnquiryModal();
      return;
    }
    openCheckoutModal();
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'phone') {
      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEnquiryChange = (e) => {
    if (e.target.name === 'phone') {
      setEnquiryData({ ...enquiryData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
      return;
    }
    setEnquiryData({ ...enquiryData, [e.target.name]: e.target.value });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    const validationError = getContactValidationError(enquiryData);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    const sanitizedPhone = normalizeIndianMobile(enquiryData.phone);
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enquiryData.name.trim(),
          phone: sanitizedPhone,
          email: enquiryData.email.trim(),
          type: isLiveCourse ? 'Course' : 'Recorded-Course',
          leadType: isLiveCourse ? 'LIVE COURSE LEAD' : 'RECORDED COURSE LEAD',
          status: 'ENQUIRY RECEIVED',
          paymentStatus: 'NOT REQUIRED',
          courseName: course.title,
          courseId: course.id,
          courseType: course.courseType,
          city: enquiryData.city,
          age: enquiryData.age,
          interest: enquiryData.interest,
          message: enquiryData.message || `Interest: ${enquiryData.interest || 'Not specified'}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Enquiry submitted. Our team will contact you soon.');
        setShowEnquiryModal(false);
        setEnquiryData({ name: '', phone: '', email: '', city: '', age: '', interest: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to submit enquiry');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    if (!RECORDED_PAYMENT_ENABLED) {
      openEnquiryModal();
      return;
    }
    try {
      const token = localStorage.getItem('studentToken');
      if (!token) {
        const validationError = getContactValidationError(formData);
        if (validationError) {
          toast.error(validationError);
          return;
        }
      }
      const sanitizedPhone = normalizeIndianMobile(formData.phone);
      setIsProcessingPayment(true);
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const orderResponse = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          courseId: course.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: sanitizedPhone,
          couponCode: appliedCoupon?.code || '',
        }),
      });
      const orderData = await orderResponse.json();

      if (!orderData.success) {
        if (orderData.code === 'PAYMENT_DISABLED' || orderResponse.status === 503) {
          toast.error('Online payment is unavailable. Please submit an enquiry.');
          setShowCheckoutModal(false);
          setShowEnquiryModal(true);
        } else {
          toast.error(orderData.message || 'Failed to create order');
        }
        setIsProcessingPayment(false);
        if (orderResponse.status === 400 || orderResponse.status === 401) {
          localStorage.removeItem('studentToken');
          setShowCheckoutModal(true);
        }
        return;
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Payment SDK failed to load.');
        setIsProcessingPayment(false);
        return;
      }

      if (!orderData.orderId) {
        toast.error('Order could not be created.');
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: Number(orderData.amount),
        currency: orderData.currency || 'INR',
        name: 'DS Institute',
        description: `Course: ${course.title}`,
        image: '/images/logo.png',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                email: orderData.email,
                name: orderData.name,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setShowCheckoutModal(false);
              navigate(
                buildPaymentSuccessPath({
                  type: 'course',
                  txn: response.razorpay_payment_id,
                  courseName: course.title,
                })
              );
            } else {
              toast.error('Payment verification failed.');
              reportPaymentFailure({
                leadId: orderData.leadId,
                orderId: orderData.orderId,
                courseId: course.id,
                courseName: course.title,
                paymentFor: 'Recorded Course',
                error: { description: 'Payment verification failed' },
                navigate,
                type: 'course',
              });
            }
          } catch {
            toast.error('Error verifying payment.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: { name: orderData.name, email: orderData.email, contact: orderData.phone },
        theme: { color: '#8B4A1E' },
        modal: { ondismiss: () => setIsProcessingPayment(false) },
      };

      if (orderData.isMock) {
        toast.success('Test mode: simulating payment…');
        options.handler({
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_order_id: orderData.orderId,
          razorpay_signature: 'mock_signature',
        });
      } else {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          reportPaymentFailure({
            leadId: orderData.leadId,
            orderId: orderData.orderId,
            courseId: course.id,
            courseName: course.title,
            paymentFor: 'Recorded Course',
            error: response.error,
            navigate,
            type: 'course',
          });
          setIsProcessingPayment(false);
        });
        rzp.open();
      }
    } catch {
      toast.error('Network error. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handleCouponApply = async (overrideCode) => {
    const codeToApply = String(overrideCode || couponCode).trim();
    if (!codeToApply) {
      toast.error('Enter a coupon code.');
      return;
    }
    if (overrideCode) setCouponCode(String(overrideCode).toUpperCase());
    setCouponLoading(true);
    setCouponStatus(null);
    try {
      const res = await fetch(`${API_BASE}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToApply, courseId: course?.id, purchaseAmount: getCoursePrice() }),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon({ ...data.coupon, code: data.coupon.code || codeToApply.toUpperCase() });
        setCouponStatus({
          type: 'success',
          message: `Saved ${data.coupon.discountType === 'fixed' ? `₹${data.coupon.discountValue}` : `${data.coupon.discountValue}%`}`,
        });
        toast.success('Coupon applied.');
      } else {
        setAppliedCoupon(null);
        setCouponStatus({ type: 'error', message: data.message || 'Invalid coupon' });
      }
    } catch {
      setCouponStatus({ type: 'error', message: 'Could not validate coupon.' });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponStatus(null);
  };

  const couponProps = {
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponStatus,
    couponLoading,
    hasAvailableCoupons,
    availableCoupons,
    onApply: handleCouponApply,
    onRemove: removeCoupon,
    getPayableAmount,
  };

  if (loading) return <PageLoader label="Loading course…" />;
  if (!course) return null;

  const ctaLabel = isProcessingPayment
    ? 'Please wait…'
    : canPayOnline
      ? appliedCoupon
        ? `Checkout · ₹${getPayableAmount()}`
        : 'Buy now'
      : isLiveCourse
        ? 'Enquire now'
        : 'Request callback';

  return (
    <div className={PAGE}>
      <SEO title={course.title} description={course.shortDesc} url={`/courses/${course.slug || course.id}`} />

      <section className="border-b border-site-accent-dark/8 py-5 sm:py-6">
        <div className={PAGE_WRAP}>
          <Link to={listPath} className={`${TYPE.backLink} !mb-4 sm:!mb-5`}>
            <ArrowLeft size={15} aria-hidden />
            {isLiveCourse ? 'All live classes' : 'All recorded courses'}
          </Link>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                {course.category ? <span className={TYPE.kicker}>{course.category}</span> : null}
                <MetaChip>{isLiveCourse ? 'Live batch' : 'Recorded'}</MetaChip>
                {course.level ? <MetaChip>{course.level}</MetaChip> : null}
                {course.duration ? (
                  <MetaChip>
                    <Clock size={11} className="text-site-accent" aria-hidden />
                    {course.duration}
                  </MetaChip>
                ) : null}
                {course.schedule ? (
                  <MetaChip>
                    <Calendar size={11} className="text-site-accent" aria-hidden />
                    {course.schedule}
                  </MetaChip>
                ) : null}
                {isRecordedCourse && course.modulesCount > 0 ? (
                  <MetaChip>
                    <BookOpen size={11} className="text-site-accent" aria-hidden />
                    {course.modulesCount} modules
                  </MetaChip>
                ) : null}
                {course.instructor ? (
                  <MetaChip>
                    <User size={11} className="text-site-accent" aria-hidden />
                    {course.instructor}
                  </MetaChip>
                ) : null}
              </div>

              <h1 className={TYPE.h1}>{course.title}</h1>
              {course.shortDesc ? (
                <p className={`${TYPE.bodySm} !mt-3 max-w-2xl !text-sm`}>{course.shortDesc}</p>
              ) : null}

              <div className="mt-5 lg:hidden">
                <EnrollPanel
                  course={course}
                  canPayOnline={canPayOnline}
                  isLiveCourse={isLiveCourse}
                  getCoursePrice={getCoursePrice}
                  getDiscountAmount={getDiscountAmount}
                  getPayableAmount={getPayableAmount}
                  appliedCoupon={appliedCoupon}
                  isProcessingPayment={isProcessingPayment}
                  ctaLabel={ctaLabel}
                  onCta={() => (canPayOnline ? initiateCheckout() : openEnquiryModal())}
                  couponProps={canPayOnline ? { ...couponProps, compact: true } : null}
                />
              </div>

              <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
                {course.longDesc && course.longDesc !== course.shortDesc ? (
                  <Section title="Overview">
                    <p className={`${TYPE.bodySm} whitespace-pre-line !text-sm leading-relaxed`}>{course.longDesc}</p>
                  </Section>
                ) : null}

                {course.topics?.length > 0 ? (
                  <Section title="What you will learn">
                    <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                      {course.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2 font-body text-sm text-site-primary">
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-site-accent" aria-hidden />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </Section>
                ) : null}

                {course.curriculum?.length > 0 ? (
                  <Section title="Curriculum">
                    <ul className="m-0 space-y-3 p-0">
                      {course.curriculum.map((module, i) => (
                        <li
                          key={module.title || i}
                          className="rounded-lg border border-site-accent-dark/10 bg-white p-3.5 sm:p-4"
                        >
                          <p className="!m-0 flex items-center gap-2 font-heading text-sm font-bold text-site-primary">
                            <Layers size={14} className="text-site-accent-dark" aria-hidden />
                            {module.title}
                          </p>
                          {module.lessons?.length > 0 ? (
                            <ul className="!mt-2 !mb-0 list-disc space-y-1 pl-5 font-body text-xs text-site-muted sm:text-sm">
                              {module.lessons.map((lesson, j) => (
                                <li key={j}>{lesson}</li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </Section>
                ) : null}

                {isLiveCourse && course.batchDetails ? (
                  <Section title="Batch details">
                    <dl className="m-0 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {course.batchDetails.startDate ? (
                        <div className="rounded-lg border border-site-accent-dark/10 bg-white px-3 py-2.5">
                          <dt className="font-body text-[0.625rem] font-bold uppercase tracking-wider text-site-soft">Start date</dt>
                          <dd className="!m-0 font-body text-sm font-semibold text-site-primary">{course.batchDetails.startDate}</dd>
                        </div>
                      ) : null}
                      {course.batchDetails.classCount ? (
                        <div className="rounded-lg border border-site-accent-dark/10 bg-white px-3 py-2.5">
                          <dt className="font-body text-[0.625rem] font-bold uppercase tracking-wider text-site-soft">Classes</dt>
                          <dd className="!m-0 font-body text-sm font-semibold text-site-primary">{course.batchDetails.classCount}</dd>
                        </div>
                      ) : null}
                      {course.batchDetails.classDuration ? (
                        <div className="rounded-lg border border-site-accent-dark/10 bg-white px-3 py-2.5">
                          <dt className="font-body text-[0.625rem] font-bold uppercase tracking-wider text-site-soft">Class duration</dt>
                          <dd className="!m-0 font-body text-sm font-semibold text-site-primary">{course.batchDetails.classDuration}</dd>
                        </div>
                      ) : null}
                      {course.batchDetails.platform ? (
                        <div className="rounded-lg border border-site-accent-dark/10 bg-white px-3 py-2.5">
                          <dt className="font-body text-[0.625rem] font-bold uppercase tracking-wider text-site-soft">Platform</dt>
                          <dd className="!m-0 font-body text-sm font-semibold text-site-primary">{course.batchDetails.platform}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </Section>
                ) : null}

                {course.instructor ? (
                  <Section title="Instructor">
                    <div className="flex items-start gap-3">
                      {course.instructorImage ? (
                        <img
                          src={course.instructorImage}
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-full object-cover"
                        />
                      ) : null}
                      <div>
                        <p className="!m-0 font-heading text-base font-bold text-site-primary">{course.instructor}</p>
                        {course.instructorBio ? (
                          <p className={`${TYPE.bodySm} !mt-1 !text-sm`}>{course.instructorBio}</p>
                        ) : null}
                      </div>
                    </div>
                  </Section>
                ) : null}

                {course.faqs?.length > 0 ? (
                  <Section title="FAQs">
                    <div className="space-y-3">
                      {course.faqs.map((faq, i) => (
                        <div key={faq.question || i} className="rounded-lg border border-site-accent-dark/10 bg-white p-3.5">
                          <p className="!m-0 font-body text-sm font-bold text-site-primary">{faq.question}</p>
                          <p className={`${TYPE.bodySm} !mt-1 !text-sm`}>{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                ) : null}

                {course.testimonials?.length > 0 ? (
                  <Section title="Student feedback">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {course.testimonials.map((t, i) => (
                        <blockquote
                          key={t.name || i}
                          className="!m-0 rounded-lg border border-site-accent-dark/10 bg-white p-3.5"
                        >
                          <p className="!m-0 font-body text-sm italic leading-relaxed text-site-muted">
                            &ldquo;{t.quote || t.text || t.message}&rdquo;
                          </p>
                          {(t.name || t.author) && (
                            <footer className="!mt-2 font-body text-xs font-bold text-site-primary">
                              — {t.name || t.author}
                            </footer>
                          )}
                        </blockquote>
                      ))}
                    </div>
                  </Section>
                ) : null}
              </div>
            </div>

            <aside className="hidden lg:block lg:sticky lg:top-[calc(var(--header-h)+0.75rem)] lg:self-start">
              <div className="overflow-hidden rounded-xl border border-site-accent-dark/10 bg-white shadow-sm">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={course.image} alt={course.title} className="block h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <EnrollPanel
                    course={course}
                    canPayOnline={canPayOnline}
                    isLiveCourse={isLiveCourse}
                    getCoursePrice={getCoursePrice}
                    getDiscountAmount={getDiscountAmount}
                    getPayableAmount={getPayableAmount}
                    appliedCoupon={appliedCoupon}
                    isProcessingPayment={isProcessingPayment}
                    ctaLabel={ctaLabel}
                    onCta={() => (canPayOnline ? initiateCheckout() : openEnquiryModal())}
                    couponProps={canPayOnline ? couponProps : null}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-site-accent-dark/10 bg-site-primary p-3 shadow-lg lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="!m-0 truncate font-body text-xs text-white/70">{course.title}</p>
            <p className="!m-0 font-heading text-base font-bold text-white">
              {canPayOnline ? `₹${getPayableAmount()}` : course.price ? `₹${Number(course.price).toLocaleString('en-IN')}` : 'Enquire'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => (canPayOnline ? initiateCheckout() : openEnquiryModal())}
            disabled={isProcessingPayment}
            className={`${BTN.primary} ${BTN.static} !min-h-[2.375rem] shrink-0 !bg-white !text-site-primary hover:!bg-site-bg`}
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      <div className="h-20 lg:hidden" aria-hidden />

      <OverlayLoader visible={isProcessingPayment} label="Processing payment…" />

      {RECORDED_PAYMENT_ENABLED && (
        <CheckoutModal
          open={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          course={course}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handlePayment}
          isProcessingPayment={isProcessingPayment}
          appliedCoupon={appliedCoupon}
          getCoursePrice={getCoursePrice}
          getDiscountAmount={getDiscountAmount}
          getPayableAmount={getPayableAmount}
          couponProps={couponProps}
        />
      )}

      <EnquiryModal
        open={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        course={course}
        enquiryData={enquiryData}
        onChange={handleEnquiryChange}
        onSubmit={handleEnquirySubmit}
      />
    </div>
  );
}

function EnrollPanel({
  course,
  canPayOnline,
  isLiveCourse,
  getCoursePrice,
  getDiscountAmount,
  getPayableAmount,
  appliedCoupon,
  isProcessingPayment,
  ctaLabel,
  onCta,
  couponProps,
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="!m-0 font-body text-[0.625rem] font-bold uppercase tracking-wider text-site-soft">Course fee</p>
        <p className={`${TYPE.price} !mt-0.5 !text-[clamp(1.25rem,2.5vw,1.625rem)]`}>
          {canPayOnline ? `₹${getPayableAmount().toLocaleString('en-IN')}` : getCoursePrice() ? `₹${getCoursePrice().toLocaleString('en-IN')}` : 'On enquiry'}
        </p>
        {canPayOnline && appliedCoupon ? (
          <p className="!mt-1 font-body text-xs text-emerald-700">
            Saved ₹{getDiscountAmount()} · was ₹{getCoursePrice().toLocaleString('en-IN')}
          </p>
        ) : null}
        <p className="!mt-1 font-body text-xs text-site-muted">
          {canPayOnline
            ? 'Instant access after payment.'
            : isLiveCourse
              ? 'Submit an enquiry for batch schedule and fees.'
              : 'Our counsellor will call you with details.'}
        </p>
      </div>

      {couponProps ? <CouponControls {...couponProps} compact /> : null}

      {!isLiveCourse && getCoursePrice() > 0 && (
        <div className="rounded-xl bg-gradient-to-br from-site-primary to-[#3a1c0c] px-4 pb-3 pt-2.5">
          <CourseTimer courseId={course?.id} label="Offer expires in" />
        </div>
      )}

      <button
        type="button"
        onClick={onCta}
        disabled={isProcessingPayment}
        className={`${BTN.primary} w-full !min-h-[2.5rem]`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

export default CourseDetail;
