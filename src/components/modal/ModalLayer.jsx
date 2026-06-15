import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/** Above SiteNavbar (1020) and mobile drawer (1055) */
export const MODAL_Z = 'z-[1200]';

/** Above open modals (e.g. payment processing overlay) */
export const MODAL_LOADER_Z = 'z-[1210]';

export function useModalBodyLock(isOpen) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${scrollbar}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);
}

export function useModalEscape(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen || !onClose) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);
}

export function useModalLock(isOpen, onClose) {
  useModalBodyLock(isOpen);
  useModalEscape(isOpen, onClose);
}

export function ModalPortal({ open, children }) {
  if (!open) return null;
  return createPortal(children, document.body);
}

export function ModalOverlay({ onClose, children, className = '' }) {
  return (
    <div
      className={`fixed inset-0 ${MODAL_Z} flex items-end justify-center bg-[#2a0f02]/60 p-0 sm:items-center sm:p-4 ${className}`}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      role="presentation"
    >
      {children}
    </div>
  );
}
