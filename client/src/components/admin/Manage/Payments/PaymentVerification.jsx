import React, { useState } from 'react';
import { X, CheckCircle, XCircle, ExternalLink, Download } from 'lucide-react';
import Swal from 'sweetalert2';

const PaymentVerification = ({ payment, onClose, onVerify }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      // In a real app, you would call an API here
      // await verifyPayment(payment.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onVerify(payment.id, true);
    } catch (error) {
      console.error('Failed to verify payment:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถยืนยันการชำระเงินได้',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      Swal.fire({
        title: 'กรุณาระบุเหตุผล',
        text: 'โปรดระบุเหตุผลในการปฏิเสธการชำระเงิน',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would call an API here
      // await rejectPayment(payment.id, rejectReason);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onVerify(payment.id, false, rejectReason);
    } catch (error) {
      console.error('Failed to reject payment:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถปฏิเสธการชำระเงินได้',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'bank_transfer':
        return 'โอนเงินผ่านธนาคาร';
      case 'credit_card':
        return 'บัตรเครดิต/เดบิต';
      case 'paypal':
        return 'PayPal';
      case 'promptpay':
        return 'พร้อมเพย์';
      default:
        return method;
    }
  };

  const handleDownloadSlip = () => {
    // In a real app, this would download the slip image
    window.open(payment.slipImage, '_blank');
  };

  const isVerified = payment.status === 'verified';
  const isRejected = payment.status === 'rejected';
  const isPending = payment.status === 'pending';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold">ตรวจสอบการชำระเงิน #{payment.id}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Payment status banner */}
          {isVerified && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center mb-6">
              <CheckCircle size={20} className="mr-2" />
              <span>การชำระเงินนี้ได้รับการยืนยันแล้ว</span>
            </div>
          )}
          
          {isRejected && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center mb-6">
              <XCircle size={20} className="mr-2" />
              <div>
                <p>การชำระเงินนี้ถูกปฏิเสธ</p>
                <p className="text-sm mt-1">เหตุผล: {payment.rejectReason}</p>
              </div>
            </div>
          )}

          {/* Payment details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3">รายละเอียดการชำระเงิน</h4>
              <table className="min-w-full">
                <tbody>
                  <tr>
                    <td className="py-2 text-gray-600">รหัสชำระเงิน:</td>
                    <td className="py-2 font-medium">{payment.id}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">รหัสคำสั่งซื้อ:</td>
                    <td className="py-2 font-medium">
                      <a 
                        href={`#/admin/orders/${payment.orderId}`} 
                        target="_blank"
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                      >
                        {payment.orderId}
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">ลูกค้า:</td>
                    <td className="py-2">{payment.customer}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">จำนวนเงิน:</td>
                    <td className="py-2 font-medium">฿{payment.amount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">วันที่ชำระ:</td>
                    <td className="py-2">{payment.date}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">วิธีการชำระเงิน:</td>
                    <td className="py-2">{getPaymentMethodText(payment.method)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">อ้างอิง:</td>
                    <td className="py-2">{payment.reference}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment slip image */}
            {payment.slipImage && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">หลักฐานการชำระเงิน</h4>
                  <button 
                    onClick={handleDownloadSlip}
                    className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                  >
                    <Download size={14} className="mr-1" />
                    ดาวน์โหลด
                  </button>
                </div>
                <div className="border rounded-md p-1 bg-gray-50">
                  <img 
                    src={payment.slipImage} 
                    alt="Payment Slip" 
                    className="w-full h-auto max-h-64 object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Verification actions */}
          {isPending && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">ดำเนินการ</h4>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  เหตุผลในการปฏิเสธ (กรณีปฏิเสธการชำระเงิน)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                  placeholder="ระบุเหตุผลในการปฏิเสธการชำระเงิน"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <XCircle size={18} className="mr-2" />
                  ปฏิเสธการชำระเงิน
                </button>
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <CheckCircle size={18} className="mr-2" />
                  ยืนยันการชำระเงิน
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;