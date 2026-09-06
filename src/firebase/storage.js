// Firebase Storage helper module
// Note: Storage is disabled as requested (Spark Plan).
// Content and asset links are managed directly in Firestore URLs.

export const isStorageEnabled = () => false;

export const validateImage = (file, maxMb = 10) => {
  if (!file) throw new Error('No file provided.');
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
    throw new Error('Please upload a valid image (JPEG, PNG, WebP, GIF, or SVG).');
  }
  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(`Image size must be smaller than ${maxMb}MB.`);
  }
  return true;
};

export const validatePdf = (file, maxMb = 20) => {
  if (!file) throw new Error('No file provided.');
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    throw new Error('Only PDF documents are allowed for resume.');
  }
  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(`PDF size must be smaller than ${maxMb}MB.`);
  }
  return true;
};

export const uploadFile = async () => {
  throw new Error(
    'Firebase Storage is currently disabled for the Spark plan. Please provide an external URL (e.g. Google Drive, GitHub, Cloudinary, Imgur, or a local path).'
  );
};

export const deleteFile = async () => {
  // No-op when Storage is disabled
  return Promise.resolve();
};
