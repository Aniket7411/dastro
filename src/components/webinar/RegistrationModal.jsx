import React from 'react';
import { createPortal } from 'react-dom';
import { useModalLock } from '../modal/ModalLayer';
import './RegistrationModal.css';

function RegistrationModal({ isOpen, onClose, formData, handleChange, handleSubmit, isSubmitting }) {
  useModalLock(isOpen, onClose);
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>
        <div className="modal-scroll-area">
          <div className="modal-content-wrapper">
            <div className="modal-image-side">
              <h4>Join the <br/><span className="text-highlight">Masterclass</span></h4>
              <p>Unlock your cosmic potential with India's leading astrology mentor.</p>
              <ul className="modal-points">
                <li><i className="fa fa-check-circle"></i> 2 Days Live Training</li>
                <li><i className="fa fa-check-circle"></i> Practical Reading Skills</li>
                <li><i className="fa fa-check-circle"></i> Q&A with DS Institute mentors</li>
              </ul>
            </div>
            <div className="modal-form-side">
              <div className="form-header-mini">
                <h3>Reserve Your Seat</h3>
                <p>Limited Seats Available at ₹99/-</p>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter Your Full Name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter Your Best Email" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-Digit Mobile Number" />
                </div>
                <button type="submit" className="cta-reg-btn w-100 justify-content-center" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Complete Registration'}
                </button>
                <p className="secure-text"><i className="fas fa-lock me-2"></i> Secured by Razorpay</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default RegistrationModal;
