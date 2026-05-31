import DOMPurify from 'dompurify';

/**
 * Sanitizes a string to prevent XSS attacks.
 * @param {string} text - The raw text/HTML to sanitize.
 * @param {object} options - Custom DOMPurify options.
 * @returns {string} - The sanitized string.
 */
export const sanitizeText = (text, options = {}) => {
  if (typeof text !== 'string') return text;
  
  // If we are on the server (Next.js SSR), DOMPurify needs a virtual DOM
  // But our dashboard and main forms are client-side.
  if (typeof window === 'undefined') {
    // On server, we can either use jsdom or just return as is (not ideal)
    // For now, if called on server, we return original
    return text;
  }

  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'u', 'a', 'p', 'br',
      'ul', 'ol', 'li', 'span', 'iframe',
      'h1', 'h2', 'h3', 'h4', 'blockquote',
    ],
    ALLOWED_ATTR: ['href', 'target', 'src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'title', 'class', 'style'],
    ...options
  });
};

/**
 * Sanitizes an entire object or FormData.
 * Useful for filtering API data before submission.
 * @param {object|FormData} data 
 */
export const sanitizeData = (data) => {
  if (!data) return data;

  // Handle FormData
  if (data instanceof FormData) {
    const newData = new FormData();
    for (const [key, value] of data.entries()) {
      if (typeof value === 'string' && key !== 'details' && key !== 'images') {
        newData.append(key, sanitizeText(value));
      } else if (key === 'details') {
        // Details is usually a stringified JSON
        try {
          const detailsJson = JSON.parse(value);
          const sanitizedDetails = sanitizeObject(detailsJson);
          newData.append(key, JSON.stringify(sanitizedDetails));
        } catch (e) {
          newData.append(key, sanitizeText(value));
        }
      } else {
        newData.append(key, value);
      }
    }
    return newData;
  }

  // Handle plain objects
  return sanitizeObject(data);
};

const sanitizeObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => (typeof item === 'object' ? sanitizeObject(item) : sanitizeText(item)));
  }

  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeText(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
    return sanitized;
  }

  return obj;
};
