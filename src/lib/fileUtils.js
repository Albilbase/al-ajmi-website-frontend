/**
 * Fixes UTF-8 Arabic filenames that were misread as Latin-1 (common with multer on Windows).
 */
export function fixMojibakeFilename(name) {
  if (!name || typeof name !== 'string') return name || '';

  if (/[\u0600-\u06FF]/.test(name)) return name;

  // Percent-encoded UTF-8 (e.g. %D8%A7%D9%84...)
  try {
    const urlDecoded = decodeURIComponent(name.replace(/\+/g, ' '));
    if (urlDecoded !== name && /[\u0600-\u06FF]/.test(urlDecoded)) return urlDecoded;
  } catch (_) {
    // ignore
  }

  // UTF-8 bytes misread as Latin-1 (multer on Windows)
  try {
    const legacyFixed = decodeURIComponent(escape(name));
    if (/[\u0600-\u06FF]/.test(legacyFixed)) return legacyFixed;
  } catch (_) {
    // ignore
  }

  try {
    const bytes = Uint8Array.from(name, (char) => char.charCodeAt(0) & 0xff);
    const utf8Fixed = new TextDecoder('utf-8').decode(bytes);
    if (/[\u0600-\u06FF]/.test(utf8Fixed) && !utf8Fixed.includes('\uFFFD')) {
      return utf8Fixed;
    }
  } catch (_) {
    // ignore
  }

  return name;
}

export function getAttachmentDisplayName(file) {
  if (!file) return '';
  const raw = file.originalname || file.filename || '';
  return fixMojibakeFilename(raw);
}

export function isEmailColumnName(columnName) {
  if (!columnName) return false;
  return /email|mail|e-mail|بريد|ايميل|إيميل|أيميل/i.test(String(columnName));
}
