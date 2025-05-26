import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CouponForm = ({ coupon, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    discount: 0,
    discountType: 'percentage',
    startDate: '',
    endDate: '',
    minPurchase: 0,
    usageLimit: null,
    isActive: true
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        discount: coupon.discount || 0,
        discountType: coupon.discountType || 'percentage',
        startDate: coupon.startDate || '',
        endDate: coupon.endDate || '',
        minPurchase: coupon.minPurchase || 0,
        usageLimit: coupon.usageLimit || null,
        isActive: coupon.isActive !== undefined ? coupon.isActive : true
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {coupon ? 'แก้ไขคูปอง' : 'สร้างคูปองใหม่'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              รหัสคูปอง
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="เช่น SUMMER25"
              required
            />
          </div>
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                ส่วนลด
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                required
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                ประเภทส่วนลด
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="percentage">เปอร์เซ็นต์ (%)</option>
                <option value="fixed">จำนวนเงิน (฿)</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                วันที่เริ่มต้น
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                วันที่สิ้นสุด
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              ยอดสั่งซื้อขั้นต่ำ (฿)
            </label>
            <input
              type="number"
              name="minPurchase"
              value={formData.minPurchase}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              จำกัดการใช้ (ครั้ง)
            </label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
              placeholder="ว่างหากไม่จำกัด"
            />
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">เปิดใช้งาน</span>
            </label>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {coupon ? 'อัพเดท' : 'สร้าง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm;