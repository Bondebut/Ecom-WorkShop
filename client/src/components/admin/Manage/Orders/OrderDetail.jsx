import React, { useState } from 'react';
import { X, Printer, FileText, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const OrderDetail = ({ order, onClose, onUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);

  // Demo order items (in a real app, these would come from the order data)
  const orderItems = [
    { id: 1, name: 'สมาร์ทโฟน XYZ', price: 12500, quantity: 1, total: 12500 },
    { id: 2, name: 'หูฟังไร้สาย ABC', price: 2200, quantity: 2, total: 4400 },
    { id: 3, name: 'เคสโทรศัพท์', price: 350, quantity: 1, total: 350 },
  ];

  // Demo customer info
  const customer = {
    name: order.customer,
    email: 'customer@example.com',
    phone: '099-999-9999',
    address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
  };

  const statuses = [
    { value: 'pending', label: 'รอดำเนินการ', icon: <Clock size={16} className="mr-1 text-yellow-500" /> },
    { value: 'processing', label: 'กำลังดำเนินการ', icon: <AlertCircle size={16} className="mr-1 text-blue-500" /> },
    { value: 'shipped', label: 'จัดส่งแล้ว', icon: <Truck size={16} className="mr-1 text-purple-500" /> },
    { value: 'delivered', label: 'ส่งมอบแล้ว', icon: <CheckCircle size={16} className="mr-1 text-green-500" /> },
    { value: 'cancelled', label: 'ยกเลิก', icon: <X size={16} className="mr-1 text-red-500" /> },
  ];

  const getStatusLabel = (statusValue) => {
    const status = statuses.find(s => s.value === statusValue);
    return status ? status.label : statusValue;
  };

  const getStatusIcon = (statusValue) => {
    const status = statuses.find(s => s.value === statusValue);
    return status ? status.icon : null;
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + item.total, 0);
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;

    const result = await Swal.fire({
      title: 'ยืนยันการเปลี่ยนสถานะ',
      text: `คุณต้องการเปลี่ยนสถานะเป็น "${getStatusLabel(newStatus)}" หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        // In a real app, you would call an API here
        // await updateOrderStatus(order.id, newStatus);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCurrentStatus(newStatus);
        onUpdateStatus(order.id, newStatus);
        
        Swal.fire({
          title: 'สำเร็จ',
          text: 'อัพเดทสถานะเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error('Failed to update order status:', error);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถอัพเดทสถานะได้',
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleExportInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    Swal.fire({
      title: 'ฟังก์ชันนี้ยังไม่พร้อมใช้งาน',
      text: 'ระบบออกใบเสร็จอยู่ระหว่างการพัฒนา',
      icon: 'info',
      confirmButtonColor: '#3085d6',
    });
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'ชำระแล้ว';
      case 'waiting':
        return 'รอชำระ';
      case 'failed':
        return 'ชำระไม่สำเร็จ';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold">รายละเอียดคำสั่งซื้อ #{order.id}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Order summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">ข้อมูลคำสั่งซื้อ</h4>
              <p className="text-sm mb-1">วันที่สั่งซื้อ: {order.date}</p>
              <p className="text-sm mb-1">
                สถานะคำสั่งซื้อ: 
                <span className={`inline-flex items-center ml-1 px-2 py-1 rounded-full text-xs ${
                  currentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  currentStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                  currentStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  currentStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getStatusIcon(currentStatus)}
                  {getStatusLabel(currentStatus)}
                </span>
              </p>
              <p className="text-sm">
                สถานะการชำระเงิน: 
                <span className={`inline-flex items-center ml-1 px-2 py-1 rounded-full text-xs ${getPaymentStatusClass(order.paymentStatus)}`}>
                  {getPaymentStatusText(order.paymentStatus)}
                </span>
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">ข้อมูลลูกค้า</h4>
              <p className="text-sm mb-1">ชื่อ: {customer.name}</p>
              <p className="text-sm mb-1">อีเมล: {customer.email}</p>
              <p className="text-sm">โทรศัพท์: {customer.phone}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">ที่อยู่จัดส่ง</h4>
              <p className="text-sm">{customer.address}</p>
            </div>
          </div>

          {/* Order items */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">รายการสินค้า</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">รวม</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">฿{item.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">฿{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">รวมเป็นเงิน</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">฿{calculateSubtotal().toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">ค่าจัดส่ง</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">฿50</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-sm font-bold text-gray-900 text-right">ยอดรวมทั้งสิ้น</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">฿{(calculateSubtotal() + 50).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order actions */}
          <div className="border-t pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-semibold mb-2">อัพเดทสถานะ</h4>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusChange(status.value)}
                      disabled={loading || currentStatus === status.value}
                      className={`px-3 py-1 rounded-md text-sm flex items-center ${
                        currentStatus === status.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {status.icon}
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handlePrintOrder}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                >
                  <Printer size={16} className="mr-1" />
                  พิมพ์
                </button>
                <button
                  onClick={handleExportInvoice}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                >
                  <FileText size={16} className="mr-1" />
                  ใบเสร็จ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;