const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary.js'); // Ensure this path is correct
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary:cloudinary,
  params: {
    folder: 'product_images',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `${originalName}_${timestamp}`;
    }
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit file size to 10MB
  }
});

module.exports = upload;
