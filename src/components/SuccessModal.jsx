import React from 'react';

function SuccessModal({ isOpen, onClose, title, message, ctaLabel, ctaAction }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(42, 15, 2, 0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 1.5rem)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid rgba(200, 131, 42, 0.15)',
          boxShadow: '0 24px 64px rgba(42, 15, 2, 0.2)',
          padding: 'clamp(1.75rem, 6vw, 2.5rem)',
          textAlign: 'center',
          position: 'relative',
          animation: 'modalIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            border: '1px solid rgba(200, 131, 42, 0.2)',
            background: '#fffaf4',
            color: '#8B4A1E',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            transition: 'all 0.2s'
          }}
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Success icon */}
        <div style={{ position: 'relative', display: 'inline-flex', marginBottom: '1.25rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <i className="fas fa-check" style={{ color: '#fff', fontSize: '28px' }}></i>
          </div>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            animation: 'pulseGlow 2s ease-in-out infinite',
            zIndex: -1
          }}></div>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading, serif)',
          color: '#2A0F02',
          fontSize: 'clamp(1.3rem, 4vw, 1.6rem)',
          fontWeight: 700,
          marginBottom: '0.75rem',
          lineHeight: 1.2
        }}>
          {title || 'Submitted Successfully!'}
        </h2>

        <p style={{
          color: '#5C2D12',
          lineHeight: 1.7,
          marginBottom: '1.5rem',
          fontSize: '0.97rem'
        }}>
          {message || 'Your request has been received. Our team will contact you within 24 hours to follow up.'}
        </p>

        {ctaAction ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button
              onClick={ctaAction}
              style={{
                background: 'linear-gradient(135deg, #8B4A1E, #2A0F02)',
                color: '#fff',
                border: 'none',
                padding: '0.85rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 4px 14px rgba(139, 74, 30, 0.3)'
              }}
            >
              {ctaLabel || 'Continue'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#fff',
                color: '#8B4A1E',
                border: '1.5px solid rgba(139, 74, 30, 0.25)',
                padding: '0.8rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #8B4A1E, #2A0F02)',
              color: '#fff',
              border: 'none',
              padding: '0.9rem 2rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              width: '100%',
              boxShadow: '0 4px 14px rgba(139, 74, 30, 0.3)'
            }}
          >
            Great, Thank You!
          </button>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.88) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.25); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default SuccessModal;
