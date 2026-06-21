import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import ErrorResponse from '../utils/errorResponse.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_secret'
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ErrorResponse('Please upload an image file', 400), false);
    }
  }
});

export const uploadSingleImage = upload.single('image');

export const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const fileBase64 = req.file.buffer.toString('base64');
    const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
    
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'luxestays_properties',
      resource_type: 'auto'
    });

    // Populate images array for Hotel/Room schema compatibility
    req.body.images = [result.secure_url];
    next();
  } catch (error) {
    console.error('Cloudinary upload failure:', error);
    next(error);
  }
};
export default { uploadSingleImage, uploadToCloudinary };
