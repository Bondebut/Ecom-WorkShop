import React, { useState, useRef } from "react";
import { createProduct } from "../../../api/Product";
import { uploadImage } from "../../../api/uploadImage";
import useEcomStore from "../../../store/ecom-store";
import "./Product.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: 3,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const token = useEcomStore((state) => state.token);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    addNewFiles(e.target.files);
  };

  // สร้าง URL สำหรับแสดงตัวอย่างภาพ
  const addNewFiles = (files) => {
  if (!files || files.length === 0) {
    return;
  }

  const newImageFiles = [...imageFiles];
  const newImagePreviewUrls = [...imagePreviewUrls];
  
  // จำนวนรูปที่สามารถเพิ่มได้อีก
  const remainingSlots = 5 - newImageFiles.length;
  
  if (remainingSlots <= 0) {
    alert("คุณมีรูปภาพครบ 5 รูปแล้ว ไม่สามารถเพิ่มได้อีก");
    return;
  }
  
  // ถ้ามีรูปใหม่มากกว่าที่เหลืออยู่
  if (files.length > remainingSlots) {
    alert(`สามารถเพิ่มได้อีกเพียง ${remainingSlots} รูปเท่านั้น จะเพิ่มเฉพาะ ${remainingSlots} รูปแรก`);
  }
  
  // เพิ่มเฉพาะรูปที่ไม่เกินจำนวนที่เหลืออยู่
  let addedCount = 0;
  
  Array.from(files).forEach((file) => {
    if (addedCount >= remainingSlots) {
      return; // ข้ามรูปที่เกินมา
    }
    
    if (file.type.match("image.*")) {
      newImageFiles.push(file);
      newImagePreviewUrls.push(URL.createObjectURL(file));
      addedCount++;
    }
  });
  
  setImageFiles(newImageFiles);
  setImagePreviewUrls(newImagePreviewUrls);
};

  // เมื่อลากไฟล์มาเหนือพื้นที่อัปโหลด
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // เมื่อลากไฟล์มาเหนือรูปภาพที่มีอยู่
  const handleDragOverImage = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(index);
  };

  // เมื่อลากออกจากพื้นที่รูปภาพ
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  // เมื่อวางไฟล์ลงในพื้นที่อัปโหลด
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addNewFiles(e.dataTransfer.files);
    }
    setDragOverIndex(null);
  };

  // เมื่อวางไฟล์ลงบนรูปภาพที่มีอยู่
  const handleDropOnImage = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      if (file.type.match("image.*")) {
        // สร้าง URL สำหรับแสดงตัวอย่างภาพใหม่
        const newImageUrl = URL.createObjectURL(file);

        // แทนที่ไฟล์และ URL ในตำแหน่งที่กำหนด
        const newImageFiles = [...imageFiles];
        const newImagePreviewUrls = [...imagePreviewUrls];

        // ถ้ามี URL เก่า ให้เคลียร์ออกเพื่อไม่ให้เกิด memory leak
        if (imagePreviewUrls[index]) {
          URL.revokeObjectURL(imagePreviewUrls[index]);
        }

        newImageFiles[index] = file;
        newImagePreviewUrls[index] = newImageUrl;

        setImageFiles(newImageFiles);
        setImagePreviewUrls(newImagePreviewUrls);
      }
    }
    setDragOverIndex(null);
  };

  // ลบรูปภาพ
  const removeImage = (index) => {
    const newImageFiles = [...imageFiles];
    const newImagePreviewUrls = [...imagePreviewUrls];

    // เคลียร์ URL เพื่อป้องกัน memory leak
    URL.revokeObjectURL(imagePreviewUrls[index]);

    newImageFiles.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);

    setImageFiles(newImageFiles);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  // บันทึกสินค้าและอัปโหลดรูปภาพในครั้งเดียว
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      alert("กรุณาเพิ่มรูปภาพสินค้าอย่างน้อย 1 รูป");
      return;
    }

    try {
      setLoading(true);

      // 1. อัปโหลดรูปภาพก่อน
      const imagesFormData = new FormData();
      imageFiles.forEach((file) => {
        imagesFormData.append("images", file);
      });

      // เรียกใช้ API อัปโหลดรูปภาพที่มีอยู่แล้ว
      const uploadResponse = await uploadImage(token, imagesFormData);

      // 2. นำข้อมูลรูปภาพที่ได้มาใช้กับข้อมูลสินค้า
      const productData = {
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        categoryId: product.categoryId,
        images: uploadResponse.data, // รูปภาพที่ได้จาก Cloudinary
      };

      // 3. บันทึกข้อมูลสินค้า
      const response = await createProduct(token, productData);

      console.log("Product saved successfully:", response.data);
      alert("บันทึกสินค้าสำเร็จ");

      // รีเซ็ตฟอร์ม
      setProduct({
        title: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: 3,
      });

      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setImageFiles([]);
      setImagePreviewUrls([]);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกสินค้า");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <div className="icon-container">
          <i className="product-icon"></i>
        </div>
        <h2>เพิ่มสินค้าใหม่</h2>
        <p>กรอกข้อมูลสินค้าเพื่อเพิ่มสินค้าใหม่เข้าคลังสินค้า</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="section-header">
            <i className="info-icon"></i>
            <h3>ข้อมูลพื้นฐาน</h3>
          </div>

          <div className="form-group">
            <label>ชื่อสินค้า *</label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              placeholder="กรอกชื่อสินค้า..."
              required
            />
          </div>

          <div className="form-group">
            <label>รายละเอียดสินค้า *</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="กรอกรายละเอียดสินค้า..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label>ราคา (บาท) *</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group half-width">
              <label>จำนวนคงคลัง *</label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>หมวดหมู่ *</label>
            <select
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">เลือกหมวดหมู่</option>
              <option value="1">เครื่องใช้ไฟฟ้า</option>
              <option value="2">เครื่องสำอาง</option>
              <option value="3">เสื้อผ้า</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <i className="image-icon"></i>
            <h3>รูปภาพสินค้า</h3>
          </div>

          <div className="image-upload-container">
            {/* พื้นที่แสดงรูปภาพ */}
            <div className="image-preview-container">
              {imagePreviewUrls.map((url, index) => (
                <div
                  key={index}
                  className={`image-item ${
                    dragOverIndex === index ? "drag-over" : ""
                  }`}
                  onDragOver={(e) => handleDragOverImage(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDropOnImage(e, index)}
                >
                  <img src={url} alt={`สินค้า ${index + 1}`} />
                  <div className="image-actions">
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="replace-overlay">
                    <span>วางภาพเพื่อแทนที่</span>
                  </div>
                </div>
              ))}

              {/* ปุ่มเพิ่มรูปภาพ */}
              <div
                className="add-image-button"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="add-icon">+</div>
                <p>เพิ่มรูปภาพ</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* คำอธิบายการอัปโหลด */}
            <div className="upload-instructions">
              <p>สามารถลากรูปภาพมาวางเพื่อเพิ่มหรือแทนที่ได้</p>
              <p>ลากภาพใหม่มาวางที่รูปภาพเดิมเพื่อแทนที่</p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "บันทึกสินค้า"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
