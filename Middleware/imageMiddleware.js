// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret',
});

// config/multer.js

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'product_images',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      const extension = file.originalname.split('.').pop();
      return `${originalName}_${timestamp}.${extension}`;
    }
  }
});

const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024 // Limit size to 10 MB (adjust as needed)
    }
  });
  

module.exports = upload;

