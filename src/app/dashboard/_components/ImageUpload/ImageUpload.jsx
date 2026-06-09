"use client";

import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';
import { BASE_URL } from '@/lib/api';
import { validateImage } from '@/lib/validation';
import styles from './ImageUpload.module.css';

/**
 * Reusable Dashboard Image Upload Component with built-in validation
 * 
 * @param {string} value - Current image URL (preview)
 * @param {function} onChange - Callback when a file is selected (returns File object)
 * @param {function} onDelete - Callback when image is removed
 * @param {string} mode - Validation profile: 'hero', 'slider', 'standard', or 'small'
 * @param {string} label - Optional internal label
 * @param {string} height - Container height (default: '200px')
 * @param {boolean} isRTL - Language direction
 */
const ImageUpload = ({ 
  value, 
  onChange, 
  onDelete, 
  mode = 'standard', 
  label = "Upload Image",
  height = "200px",
  isRTL = false
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValid = validateImage(file, mode, isRTL);
      if (isValid) {
        onChange(file);
      } else {
        // Clear input so same file can't be selected twice if rejected
        e.target.value = '';
      }
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const displayUrl = value ? getImageUrl(value) : "";

  return (
    <div className={styles.container} style={{ height }}>
      <input 
        type="file" 
        hidden 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
      />

      {displayUrl ? (
        <div className={styles.previewWrapper}>
          <img src={displayUrl} alt="Preview" className={styles.image} />
          <div 
            className={`${styles.overlay} ${mode === 'small' ? styles.smallOverlay : ''}`}
            onClick={() => { if(mode === 'small') fileInputRef.current?.click() }}
          >
             {mode === 'small' ? (
                <ImageIcon size={28} color="white" />
             ) : (
                <div className={styles.actions}>
                  <button 
                    type="button"
                    className={styles.actionBtn} 
                    onClick={() => fileInputRef.current?.click()}
                    title={isRTL ? "تغيير" : "Change"}
                  >
                    <ImageIcon size={18} />
                    <span>{isRTL ? "تغيير" : "Change"}</span>
                  </button>
                  <button 
                     type="button"
                     className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                     onClick={(e) => { e.stopPropagation(); onDelete(); }}
                     title={isRTL ? "حذف" : "Delete"}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
             )}
          </div>

          {mode === 'small' && (
            <button 
              type="button"
              className={styles.smallDeleteTopBtn}
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              title={isRTL ? "حذف" : "Delete"}
            >
              <Trash2 size={14} />
            </button>
          )}
          {mode !== 'small' && (
            <div className={styles.badge}>
              <CheckCircle2 size={12} />
              <span>{mode.toUpperCase()}</span>
            </div>
          )}
        </div>
      ) : (
        <div 
          className={styles.uploadPlaceholder} 
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={styles.iconCircle}>
            <UploadCloud size={32} />
          </div>
          <div className={styles.textWrapper}>
            <span className={styles.mainText}>{isRTL ? "اضغط لرفع صورة" : "Click to upload image"}</span>
            <span className={styles.subText}>
              {mode === 'hero' || mode === 'slider' 
                ? (isRTL ? "حد الحجم لصور البانر: 5MB" : "Banner limit: 5MB")
                : (isRTL ? "حد الحجم الأقصى: 1MB" : "Max limit: 1MB")
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
