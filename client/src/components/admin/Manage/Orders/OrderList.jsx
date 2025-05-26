import React, { useState, useEffect } from 'react';
import { Eye, FileText, Search, Filter } from 'lucide-react';
import OrderDetail from './OrderDetail';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // API call to get orders would go here
      // const response = await getOrders();
      // setOrders(response.data);
      
      // Placeholder data for demonstration
      setOrders([
        { 
          id: 'ORD-001', 
          customer: 'John Doe', 
          date: '2025-05-20', 
          total: 2500, 
          status: 'pending',
          paymentStatus: 'waiting' 
        },
        { 
          id: 'ORD-002', 
          customer: 'Jane Smith', 
          date: '2025-05-19', 
          total: 1200, 
          status: 'processing',
          paymentStatus: 'paid' 
        },
        { 
          id: 'ORD-003', 
          customer: 'Bob Johnson', 
          date: '2025-05-18', 
          total: 3600, 
          status: 'shipped',
          paymentStatus: 'paid' 
        },
        { 
          id: 'ORD-004', 
          customer: 'Alice Brown', 
          date: '2025-05-17', 
          total: 4200, 
          status: 'delivered',
          paymentStatus: 'paid' 
        },
      ]);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">จัดการคำสั่งซื้อ</h2>
        <button
          onClick={() => {/* Print report */}}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FileText size={18} className="mr-2" />
          พิมพ์รายงาน
        </button>
      </div>

      <div className="flex mb-4 gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาตาม ID หรือชื่อลูกค้า..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border rounded-md w-full appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ทุกสถานะ</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="processing">กำลังดำเนินการ</option>
            <option value="shipped">จัดส่งแล้ว</option>
            <option value="delivered">ส่งมอบแล้ว</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">กำลังโหลด...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">รหัสคำสั่งซื้อ</th>
                <th className="py-2 px-4 border-b text-left">ลูกค้า</th>
                <th className="py-2 px-4 border-b text-left">วันที่</th>
                <th className="py-2 px-4 border-b text-right">ยอดรวม</th>
                <th className="py-2 px-4 border-b text-left">สถานะคำสั่งซื้อ</th>
                <th className="py-2 px-4 border-b text-left">สถานะการชำระเงิน</th>
                <th className="py-2 px-4 border-b text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium">{order.id}</td>
                  <td className="py-2 px-4 border-b">{order.customer}</td>
                  <td className="py-2 px-4 border-b">{order.date}</td>
                  <td className="py-2 px-4 border-b text-right">฿{order.total.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                      {order.status === 'pending' && 'รอดำเนินการ'}
                      {order.status === 'processing' && 'กำลังดำเนินการ'}
                      {order.status === 'shipped' && 'จัดส่งแล้ว'}
                      {order.status === 'delivered' && 'ส่งมอบแล้ว'}
                      {order.status === 'cancelled' && 'ยกเลิก'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusClass(order.paymentStatus)}`}>
                      {order.paymentStatus === 'paid' && 'ชำระแล้ว'}
                      {order.paymentStatus === 'waiting' && 'รอชำระ'}
                      {order.paymentStatus === 'failed' && 'ชำระไม่สำเร็จ'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleViewOrder(order)}
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

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(orderId, newStatus) => {
            // Update order status logic would go here
            setOrders(orders.map(order => 
              order.id === orderId ? { ...order, status: newStatus } : order
            ));
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderList;