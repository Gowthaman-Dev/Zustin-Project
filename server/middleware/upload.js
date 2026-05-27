// backend/middleware/upload.js
import multer from 'multer';

// Memory storage (buffer will be used for Cloudinary)
const storage = multer.memoryStorage();

// File filter: only images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);
  }
};

// Limits: 10MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter,
});

// Export middleware for single file with field name "image"
export const uploadSingle = upload.single('image');