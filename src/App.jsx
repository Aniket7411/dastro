import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import StandaloneLayout from './layouts/StandaloneLayout';
import { Suspense, lazy, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SettingsProvider } from './context/SettingsContext';
import CookieConsent from './components/CookieConsent';
import FloatingChatAssistant from './components/FloatingChatAssistant';
import { HelmetProvider } from 'react-helmet-async';

const Home = lazy(() => import('./pages/Home'));
const Consultations = lazy(() => import('./pages/Consultations'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cancellation = lazy(() => import('./pages/Cancellation'));
const Astrologer = lazy(() => import('./pages/Astrologer'));
const FreeTools = lazy(() => import('./pages/FreeTools'));
const Numerology = lazy(() => import('./pages/Numerology'));
const Tarot = lazy(() => import('./pages/Tarot'));
const Love = lazy(() => import('./pages/Love'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Webinar = lazy(() => import('./pages/Webinar'));
const Payment = lazy(() => import('./pages/Payment'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AstroShop = lazy(() => import('./pages/AstroShop'));
const ShopCheckout = lazy(() => import('./pages/ShopCheckout'));
const ShopCategory = lazy(() => import('./pages/ShopCategory'));
const ConsultationDetail = lazy(() => import('./pages/ConsultationDetail'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Careers = lazy(() => import('./pages/Careers'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const StudentLogin = lazy(() => import('./pages/StudentLogin'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboardTailwind'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LazyImageLoader() {
  useEffect(() => {
    const applyLazy = () => {
      document.querySelectorAll('img:not([loading]):not([fetchpriority="high"])').forEach((img) => {
        img.loading = 'lazy';
      });
    };
    applyLazy();
    const observer = new MutationObserver(applyLazy);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <LazyImageLoader />
          <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <CookieConsent />
          <FloatingChatAssistant />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="book-consultation" element={<Consultations />} />
                <Route path="book-consultation/:serviceId" element={<ConsultationDetail />} />
                <Route path="consultations" element={<Consultations />} />
                <Route path="consultations/:serviceId" element={<ConsultationDetail />} />
                <Route path="about" element={<About />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogDetail />} />
                <Route path="contact" element={<Contact />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-and-conditions" element={<Terms />} />
                <Route path="refund-policy" element={<Cancellation />} />
                <Route path="astrologer" element={<Astrologer />} />
                <Route path="vedic-course" element={<Navigate to="/live-courses" replace />} />
                <Route path="advanced-astrology" element={<Navigate to="/live-courses" replace />} />
                <Route path="predictive-astrology" element={<Navigate to="/recorded-courses" replace />} />
                <Route path="certification-courses" element={<Navigate to="/courses" replace />} />
                <Route path="courses" element={<Courses />} />
                <Route path="live-courses" element={<Courses mode="live" />} />
                <Route path="recorded-courses" element={<Courses mode="recorded" />} />
                <Route path="courses/:courseId" element={<CourseDetail />} />
                <Route path="free-tools" element={<FreeTools />} />
                <Route path="numerology" element={<Numerology />} />
                <Route path="tarot" element={<Tarot />} />
                <Route path="love" element={<Love />} />
                <Route path="shop" element={<AstroShop />} />
                <Route path="shop/checkout" element={<ShopCheckout />} />
                <Route path="shop/:category" element={<ShopCategory />} />
                <Route path="careers" element={<Careers />} />
                <Route path="login" element={<StudentLogin />} />
                <Route path="admin/login" element={<AdminLogin />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="student/course/:id" element={<CoursePlayer />} />
              </Route>

              <Route element={<StandaloneLayout />}>
                <Route path="/webinar" element={<Webinar />} />
                <Route path="/course-inquiry" element={<LandingPage />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentFailed />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SettingsProvider>
    </HelmetProvider>
  );
}

export default App;
