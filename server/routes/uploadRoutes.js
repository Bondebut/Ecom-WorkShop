const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { uploadImages } = require('../controllers/uploadController');

// รองรับการอัปโหลดหลายไฟล์ (ใช้ upload.array)
router.post('/images', upload.array('images', 5), uploadImages);

module.exports = router;