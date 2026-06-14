import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const txn = searchParams.get('txn') || searchParams.get('razorpay_payment_id');
  const type = searchParams.get('type') || 'payment';
  const courseName = searchParams.get('course') || searchParams.get('courseName');

  const getMessage = () => {
    if (type === 'consultation') {
      return 'Your consultation has been booked successfully. Our expert will contact you within 24 hours to confirm your session details.';
    }
    if (type === 'course' || courseName) {
      return `You are now enrolled${courseName ? ` in ${courseName}` : ''}. Your login credentials have been sent to your email. Check your inbox (and spam folder) to access your course.`;
    }
    return 'Your payment was processed successfully. A confirmation has been sent to your registered email address.';
  };

  const getTitle = () => {
    if (type === 'consultation') return 'Consultation Booked!';
    if (type === 'course' || courseName) return 'Enrollment Successful!';
    return 'Payment Successful!';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FDF6EE 0%, #f4ead8 100%)',
      padding: 'clamp(1rem, 4vw, 2rem)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
        width: '100%',
        maxWidth: '480px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid rgba(200, 131, 42, 0.15)',
        boxShadow: '0 20px 60px rgba(139, 74, 30, 0.12)',
        padding: 'clamp(2rem, 6vw, 3rem)',
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{ position: 'relative', display: 'inline-flex', marginBottom: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
            animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <i className="fas fa-check" style={{ color: '#fff', fontSize: '32px' }}></i>
          </div>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.12)',
            animation: 'pulse 2s ease-in-out infinite',
            zIndex: -1
          }}></div>
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#ecfdf5',
          color: '#065f46',
          padding: '4px 14px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem'
        }}>
          <i className="fas fa-shield-alt" style={{ fontSize: '10px' }}></i>
          PAYMENT VERIFIED
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          color: '#2A0F02',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 700,
          marginBottom: '0.75rem',
          lineHeight: 1.2
        }}>{getTitle()}</h1>

        <p style={{
          color: '#5C2D12',
          lineHeight: 1.7,
          marginBottom: '1.5rem',
          fontSize: '1rem'
        }}>{getMessage()}</p>

        {txn && (
          <div style={{
            background: '#fffbf5',
            border: '1px solid rgba(200, 131, 42, 0.2)',
            borderRadius: '12px',
            padding: '0.9rem 1rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ color: '#9B6640', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem', fontWeight: 600 }}>
              Transaction ID
            </div>
            <code style={{ color: '#8B4A1E', wordBreak: 'break-all', fontSize: '0.88rem', fontWeight: 700 }}>{txn}</code>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {type === 'course' || courseName ? (
            <Link to="/login" style={{
              background: 'linear-gradient(135deg, #8B4A1E, #2A0F02)',
              color: '#fff',
              textDecoration: 'none',
              padding: '0.9rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'block',
              boxShadow: '0 4px 14px rgba(139, 74, 30, 0.3)'
            }}>
              <i className="fas fa-graduation-cap me-2"></i>Access Your Course
            </Link>
          ) : (
            <Link to="/book-consultation" style={{
              background: 'linear-gradient(135deg, #8B4A1E, #2A0F02)',
              color: '#fff',
              textDecoration: 'none',
              padding: '0.9rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'block',
              boxShadow: '0 4px 14px rgba(139, 74, 30, 0.3)'
            }}>
              <i className="fas fa-calendar-check me-2"></i>View My Bookings
            </Link>
          )}
          <Link to="/" style={{
            background: '#fff',
            color: '#8B4A1E',
            textDecoration: 'none',
            padding: '0.85rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1rem',
            display: 'block',
            border: '1.5px solid rgba(139, 74, 30, 0.25)'
          }}>
            <i className="fas fa-home me-2"></i>Return to Home
          </Link>
        </div>

        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#9B6640' }}>
          <i className="fas fa-envelope me-1"></i>
          A confirmation has been sent to your email.
        </p>
      </motion.div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default PaymentSuccess;
