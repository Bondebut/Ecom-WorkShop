import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter, FileText, Calendar } from 'lucide-react';
import PaymentVerification from './PaymentVerification';
import Swal from 'sweetalert2';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      // API call to get payments would go here
      // const response = await getPayments();
      // setPayments(response.data);
      
      // Placeholder data for demonstration
      setTimeout(() => {
        setPayments([
          { 
            id: 'PAY001', 
            orderId: 'ORD-001',
            customer: 'John Doe', 
            amount: 2500, 
            method: 'bank_transfer',
            date: '2025-05-20',
            status: 'pending',
            reference: 'TRNF123456',
            slipImage: 'https://placehold.co/400x600/png' 
          },
          { 
            id: 'PAY002', 
            orderId: 'ORD-002',
            customer: 'Jane Smith', 
            amount: 1200, 
            method: 'credit_card',
            date: '2025-05-19',
            status: 'verified',
            reference: '4111XXXX1111' 
          },
          { 
            id: 'PAY003', 
            orderId: 'ORD-003',
            customer: 'Bob Johnson', 
            amount: 3600, 
            method: 'paypal',
            date: '2025-05-18',
            status: 'verified',
            reference: 'PP87654321' 
          },
          { 
            id: 'PAY004', 
            orderId: 'ORD-004',
            customer: 'Alice Brown', 
            amount: 4200, 
            method: 'bank_transfer',
            date: '2025-05-17',
            status: 'rejected',
            reference: 'TRNF654321',
            slipImage: 'https://placehold.co/400x600/png',
            rejectReason: 'ยอดเงินไม่ตรงกับคำสั่งซื้อ' 
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load payments:', error);
      setLoading(false);
    }
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
  };

  const handleVerifyPayment = (paymentId, isVerified, rejectReason = '') => {
    // In a real app, call an API to update payment status
    // Update local state for demo purposes
    setPayments(payments.map(payment => {
      if (payment.id === paymentId) {
        return {
          ...payment,
          status: isVerified ? 'verified' : 'rejected',
          rejectReason: isVerified ? '' : rejectReason
        };
      }
      return payment;
    }));
    
    setSelectedPayment(null);
    
    Swal.fire({
      title: isVerified ? 'ยืนยันการชำระเงินสำเร็จ' : 'ปฏิเสธการชำระเงินสำเร็จ',
      icon: isVerified ? 'success' : 'info',
      confirmButtonColor: '#3085d6'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'รอตรวจสอบ';
      case 'verified':
        return 'ยืนยันแล้ว';
      case 'rejected':
        return 'ปฏิเสธ';
      default:
        return status;
    }
  };

  const handleExportReport = () => {
    Swal.fire({
      title: 'ฟังก์ชันนี้ยังไม่พร้อมใช้งาน',
      text: 'ระบบออกรายงานอยู่ระหว่างการพัฒนา',
      icon: 'info',
      confirmButtonColor: '#3085d6',
    });
  };

  const filteredPayments = payments.filter(payment => {
    // Filter by search term
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    // Filter by date range
    let matchesDateRange = true;
    if (dateRange.from) {
      matchesDateRange = matchesDateRange && payment.date >= dateRange.from;
    }
    if (dateRange.to) {
      matchesDateRange = matchesDateRange && payment.date <= dateRange.to;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">จัดการการชำระเงิน</h2>
        <button
          onClick={handleExportReport}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FileText size={18} className="mr-2" />
          รายงานการชำระเงิน
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาตาม ID, คำสั่งซื้อ, ลูกค้า..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border rounded-md w-full appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ทุกสถานะ</option>
            <option value="pending">รอตรวจสอบ</option>
            <option value="verified">ยืนยันแล้ว</option>
            <option value="rejected">ปฏิเสธ</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="date"
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              value={dateRange.from}
              onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              placeholder="จากวันที่"
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="date"
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              value={dateRange.to}
              onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              placeholder="ถึงวันที่"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">กำลังโหลด...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">รหัสชำระเงิน</th>
                <th className="py-2 px-4 border-b text-left">คำสั่งซื้อ</th>
                <th className="py-2 px-4 border-b text-left">ลูกค้า</th>
                <th className="py-2 px-4 border-b text-left">วิธีการชำระเงิน</th>
                <th className="py-2 px-4 border-b text-left">อ้างอิง</th>
                <th className="py-2 px-4 border-b text-left">วันที่</th>
                <th className="py-2 px-4 border-b text-right">จำนวนเงิน</th>
                <th className="py-2 px-4 border-b text-left">สถานะ</th>
                <th className="py-2 px-4 border-b text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium">{payment.id}</td>
                  <td className="py-2 px-4 border-b">{payment.orderId}</td>
                  <td className="py-2 px-4 border-b">{payment.customer}</td>
                  <td className="py-2 px-4 border-b">{getPaymentMethodText(payment.method)}</td>
                  <td className="py-2 px-4 border-b">{payment.reference}</td>
                  <td className="py-2 px-4 border-b">{payment.date}</td>
                  <td className="py-2 px-4 border-b text-right">฿{payment.amount.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleViewPayment(payment)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPayment && (
        <PaymentVerification
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onVerify={(paymentId, isVerified, rejectReason) => 
            handleVerifyPayment(paymentId, isVerified, rejectReason)
          }
        />
      )}
    </div>
  );
};

export default PaymentList;