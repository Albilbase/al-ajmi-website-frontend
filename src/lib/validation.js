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
    const maxSize = 900 * 1024 * 1024; // 300MB for video
  
    if (!file) return false;
  
    // 1. Format Check: allow all video types or typical video extensions if type is empty
    const fileName = file.name || '';
    const extension = fileName.split('.').pop().toLowerCase();
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'mkv', 'flv', '3gp', 'm4v'];

    if (!file.type.startsWith('video/') && !videoExtensions.includes(extension)) {
      const errorMsg = isRTL 
        ? "عذراً، نوع الملف غير مدعوم كفيديو. يرجى اختيار ملف فيديو صالح" 
        : "Unsupported video format. Please select a valid video file.";
      toast.error(errorMsg);
      return false;
    }
  
    // 2. Size Check
    if (file.size > maxSize) {
      const errorMsg = isRTL 
        ? `حجم الفيديو كبير جداً. الحد الأقصى المسموح هو 900MB` 
        : `Video is too large. Maximum allowed is 900MB`;
      toast.error(errorMsg);
      return false;
    }
  
    return true;
  };


const PHONE_COUNTRY_CODES = [
  '00966', '00971', '00965', '00974', '00973', '00968',
  '00962', '0020', '00961', '00964', '0090', '001', '0044',
];

/**
 * Validates phone: country code (dropdown) + exactly 9 digits, no leading zero
 * @param {string} value - Full value e.g. 009665XXXXXXXX
 * @returns {boolean}
 */
export const validatePhone = (value) => {
  if (!value) return false;
  const matchedCode = PHONE_COUNTRY_CODES.find((code) => value.startsWith(code));
  if (!matchedCode) return false;
  const numberPart = value.slice(matchedCode.length);
  return /^[1-9][0-9]{8}$/.test(numberPart);
};

/**
 * Keeps only ASCII letters, digits, @ and . for email input
 */
export const sanitizeEmailInput = (value) => {
  return (value || '').replace(/[^a-zA-Z0-9@.]/g, '');
};

/** Allowed TLDs only — rejects fake endings like .xnpgba */
const ALLOWED_EMAIL_TLDS = new Set([
  'com', 'net', 'org', 'edu', 'gov', 'info', 'biz',
  'sa', 'ae', 'kw', 'qa', 'bh', 'om', 'jo', 'eg', 'lb', 'iq',
]);

/**
 * Valid email: Latin only, local@domain.tld with an allowed TLD (e.g. .com, .net, .sa)
 */
export const validateEmail = (value) => {
  if (!value) return false;
  const match = value.match(
    /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*\.([a-zA-Z]{2,})$/
  );
  if (!match?.[1]) return false;
  const tld = match[1].toLowerCase();
  return ALLOWED_EMAIL_TLDS.has(tld);
};
