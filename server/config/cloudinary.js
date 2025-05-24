const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


// ตั้งค่า Cloudinary 
cloudinary.config({
  cloud_name: 'dr2qrylkl',
  api_key: '297329534924254',
  api_secret: 'ifPwc-a9GaeTnoe3U8I4-l2AAjk',
});

// สร้าง storage engine สำหรับ multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecom-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, crop: "limit" }]
  }
});

// สร้าง middleware สำหรับอัปโหลดไฟล์
const upload = multer({ storage: storage });

module.exports = {
  cloudinary,
  upload
};