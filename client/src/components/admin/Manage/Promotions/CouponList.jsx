import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Calendar } from 'lucide-react';
import CouponForm from './CouponForm';
import Swal from 'sweetalert2';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      // API call to get coupons would go here
      // ใช้ setTimeout เพื่อจำลองการโหลดข้อมูล
      setTimeout(() => {
        setCoupons([
          { 
            id: 1, 
            code: 'SUMMER25', 
            discount: 25, 
            discountType: 'percentage',
            startDate: '2025-06-01',
            endDate: '2025-08-31',
            minPurchase: 1000,
            usageLimit: 100,
            usageCount: 12,
            isActive: true
          },
          { 
            id: 2, 
            code: 'WELCOME100', 
            discount: 100, 
            discountType: 'fixed',
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            minPurchase: 500,
            usageLimit: 1,
            usageCount: 43,
            isActive: true
          },
          { 
            id: 3, 
            code: 'FLASH50', 
            discount: 50, 
            discountType: 'percentage',
            startDate: '2025-05-15',
            endDate: '2025-05-17',
            minPurchase: 0,
            usageLimit: 200,
            usageCount: 98,
            isActive: false
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load coupons:', error);
      setLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditCoupon(coupon);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบคูปองนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      try {
        // API call to delete coupon would go here
        // await deleteCoupon(id);
        setCoupons(coupons.filter(coupon => coupon.id !== id));
        Swal.fire('สำเร็จ', 'ลบคูปองเรียบร้อยแล้ว', 'success');
      } catch (error) {
        console.error('Failed to delete coupon:', error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบคูปองได้', 'error');
      }
    }
  };

  const handleFormSubmit = (couponData) => {
    if (editCoupon) {
      // Update existing coupon
      setCoupons(coupons.map(coupon => 
        coupon.id === editCoupon.id ? { ...coupon, ...couponData } : coupon
      ));
    } else {
      // Add new coupon
      setCoupons([...coupons, { id: Date.now(), ...couponData, usageCount: 0 }]);
    }
    setShowForm(false);
    setEditCoupon(null);
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">จัดการคูปองและโปรโมชั่น</h2>
        <button
          onClick={() => {
            setEditCoupon(null);
            setShowForm(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          สร้างคูปองใหม่
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">กำลังโหลด...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">รหัสคูปอง</th>
                <th className="py-2 px-4 border-b text-left">ส่วนลด</th>
                <th className="py-2 px-4 border-b text-left">ระยะเวลา</th>
                <th className="py-2 px-4 border-b text-left">ยอดขั้นต่ำ</th>
                <th className="py-2 px-4 border-b text-left">จำกัดการใช้</th>
                <th className="py-2 px-4 border-b text-left">ใช้ไปแล้ว</th>
                <th className="py-2 px-4 border-b text-left">สถานะ</th>
                <th className="py-2 px-4 border-b text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium">{coupon.code}</td>
                  <td className="py-2 px-4 border-b">
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discount}%` 
                      : `฿${coupon.discount}`}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-gray-500" />
                      {coupon.startDate} ถึง {coupon.endDate}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {coupon.minPurchase > 0 ? `฿${coupon.minPurchase}` : '-'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {coupon.usageLimit || 'ไม่จำกัด'}
                  </td>
                  <td className="py-2 px-4 border-b">{coupon.usageCount}</td>
                  <td className="py-2 px-4 border-b">
                    {isExpired(coupon.endDate) ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        หมดอายุ
                      </span>
                    ) : coupon.isActive ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        ใช้งานได้
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        ปิดใช้งาน
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <CouponForm
          coupon={editCoupon}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditCoupon(null);
          }}
        />
      )}
    </div>
  );
};

export default CouponList;