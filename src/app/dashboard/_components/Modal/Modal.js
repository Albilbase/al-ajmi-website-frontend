
"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

/**
 * Reusable Dashboard Modal Component
 * 
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Function to call when closing
 * @param {string} title - Header title
 * @param {React.ReactNode} children - Modal content
 * @param {React.ReactNode} footer - Optional footer actions
 * @param {string} maxWidth - Custom max-width (default: 550px)
 * @param {string} maxHeight - Custom max-height (default: 90vh)
 * @param {boolean} showCloseButton - Whether to show the X button (default: true)
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = "550px",
  maxHeight = "90vh",
  showCloseButton = true
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div 
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ 
              maxWidth: maxWidth,
              maxHeight: maxHeight
            }}
          >
            {(title || showCloseButton) && (
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>{title}</h3>
                {showCloseButton && (
                  <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
                    <X size={24} />
                  </button>
                )}
              </div>
            )}

            <div className={styles.modalBody}>
              {children}
            </div>

            {footer && (
              <div className={styles.modalFooter}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
