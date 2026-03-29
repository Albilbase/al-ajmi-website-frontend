import { toast } from 'react-toastify';

/**
 * Validates an image file based on type and size.
 * @param {File} file - The file to validate.
 * @param {string} mode - 'hero', 'standard', or 'small'.
 * @param {boolean} isRTL - Language direction.
 * @returns {boolean} - Returns true if valid, false otherwise.
 */
export const validateImage = (file, mode = 'standard', isRTL = false) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  
  // High quality for banners (5MB), Optimized for cards (1MB), Tiny for icons (500KB)
  const maxSizes = {
    hero: 5 * 1024 * 1024,
    slider: 5 * 1024 * 1024,
    standard: 1 * 1024 * 1024, 
    small: 500 * 1024
  };

  if (!file) return false;

  // 1. Format Check
  if (!allowedTypes.includes(file.type)) {
    const errorMsg = isRTL 
      ? "عذراً، نوع الملف غير مدعوم. يرجى اختيار صورة بصيغة (JPG, PNG, WebP)" 
      : "Unsupported file type. Please select an image (JPG, PNG, WebP)";
    toast.error(errorMsg);
    return false;
  }

  // 2. Size Check
  const limit = maxSizes[mode] || maxSizes.standard;
  if (file.size > limit) {
    const sizeInMB = (limit / (1024 * 1024)).toFixed(0);
    const errorMsg = isRTL 
      ? `حجم الصورة كبير جداً لهذا القسم. الحد الأقصى المسموح هو ${sizeInMB}MB` 
      : `Image is too large for this section. Maximum allowed is ${sizeInMB}MB`;
    toast.error(errorMsg);
    return false;
  }

  return true;
};

/**
 * Validates a video file based on type and size.
 * @param {File} file - The file to validate.
 * @param {boolean} isRTL - Language direction.
 * @returns {boolean} - Returns true if valid, false otherwise.
 */
export const validateVideo = (file, isRTL = false) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const maxSize = 50 * 1024 * 1024; // 50MB for video
  
    if (!file) return false;
  
    // 1. Format Check
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = isRTL 
        ? "عذراً، نوع الملف غير مدعوم كفيديو. يرجى اختيار فيديو بصيغة (MP4, WebM, OGG)" 
        : "Unsupported video format. Please select a video (MP4, WebM, OGG)";
      toast.error(errorMsg);
      return false;
    }
  
    // 2. Size Check
    if (file.size > maxSize) {
      const errorMsg = isRTL 
        ? `حجم الفيديو كبير جداً. الحد الأقصى المسموح هو 50MB` 
        : `Video is too large. Maximum allowed is 50MB`;
      toast.error(errorMsg);
      return false;
    }
  
    return true;
  };


/**
 * Validates a Saudi phone number (10 digits local or international 00966/+966)
 * @param {string} value - The phone number string
 * @returns {boolean} - True if valid
 */
export const validatePhone = (value) => {
  if (!value) return false;
  const clean = value.replace(/[^0-9+]/g, '');
  // Matches: 
  // 1. Local: 0XXXXXXXXX (10 digits)
  // 2. International: 00966XXXXXXXXX (14 digits)
  // 3. International: +966XXXXXXXXX (13 digits)
  return /^(0[0-9]{9}|00966[0-9]{9}|\+966[0-9]{9})$/.test(clean);
};
