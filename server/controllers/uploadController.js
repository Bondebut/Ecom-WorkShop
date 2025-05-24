const { cloudinary } = require('../config/cloudinary');

exports.uploadImages = async (req, res) => {
  try {
    const files = req.files;
    
    const images = files.map(file => ({
      asset_id: file.asset_id || file.filename,
      public_id: file.public_id || file.path.split('/').pop(), // ดึง public_id จากไฟล์
      url: file.url || file.path,
      secure_url: file.secure_url || file.path
    }));
    
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload error" });
  }
};