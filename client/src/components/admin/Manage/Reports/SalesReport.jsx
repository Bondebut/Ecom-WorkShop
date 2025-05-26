import React, { useState, useEffect } from 'react';
import { Calendar, Download, DollarSign, TrendingUp, Users, ShoppingBag, Filter } from 'lucide-react';
import Swal from 'sweetalert2';

const SalesReport = () => {
  const [loading, setLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState('weekly');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    salesByDate: [],
    salesByPaymentMethod: [],
    salesByCategory: []
  });

  useEffect(() => {
    loadSalesData();
  }, [timeFrame]);

  const loadSalesData = async () => {
    setLoading(true);
    try {
      // In a real app, you would call an API with the timeframe
      // const response = await getSalesData(timeFrame, dateRange.from, dateRange.to);
      // setSalesData(response.data);
      
      // Generate mock data based on timeframe
      setTimeout(() => {
        const mockData = generateMockData(timeFrame);
        setSalesData(mockData);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load sales data:', error);
      setLoading(false);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลรายงานได้',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const generateMockData = (timeframe) => {
    const now = new Date();
    let days = 7;
    
    if (timeframe === 'daily') days = 24; // Hours in a day
    if (timeframe === 'weekly') days = 7;
    if (timeframe === 'monthly') days = 30;
    if (timeframe === 'yearly') days = 12; // Months in a year
    
    // Generate labels (dates or times)
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      if (timeframe === 'daily') {
        // Hours in a day
        date.setHours(i);
        return `${date.getHours()}:00`;
      } else if (timeframe === 'yearly') {
        // Months in a year
        date.setMonth(i);
        return date.toLocaleString('th-TH', { month: 'short' });
      } else {
        // Days
        date.setDate(date.getDate() - (days - i - 1));
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
      }
    });
    
    // Generate random sales data
    const salesByDate = labels.map(label => {
      const baseSales = timeframe === 'yearly' ? 500000 : (timeframe === 'monthly' ? 100000 : 10000);
      const randomFactor = 0.5 + Math.random();
      const sales = Math.round(baseSales * randomFactor);
      
      return {
        label,
        sales
      };
    });
    
    // Calculate totals
    const totalSales = salesByDate.reduce((sum, item) => sum + item.sales, 0);
    const totalOrders = Math.round(totalSales / 1500); // Average order ~1500 baht
    
    // Generate payment method distribution
    const salesByPaymentMethod = [
      { method: 'bank_transfer', label: 'โอนเงินผ่านธนาคาร', sales: Math.round(totalSales * 0.45) },
      { method: 'credit_card', label: 'บัตรเครดิต', sales: Math.round(totalSales * 0.30) },
      { method: 'promptpay', label: 'พร้อมเพย์', sales: Math.round(totalSales * 0.20) },
      { method: 'paypal', label: 'PayPal', sales: Math.round(totalSales * 0.05) }
    ];
    
    // Generate category distribution
    const salesByCategory = [
      { category: 'อิเล็กทรอนิกส์', sales: Math.round(totalSales * 0.35) },
      { category: 'เสื้อผ้า', sales: Math.round(totalSales * 0.25) },
      { category: 'เครื่องใช้ในบ้าน', sales: Math.round(totalSales * 0.15) },
      { category: 'อาหารและเครื่องดื่ม', sales: Math.round(totalSales * 0.10) },
      { category: 'ความงามและสุขภาพ', sales: Math.round(totalSales * 0.15) }
    ];
    
    return {
      totalSales,
      totalOrders,
      averageOrderValue: Math.round(totalSales / totalOrders),
      conversionRate: Math.round(totalOrders / (totalOrders * 3.5) * 100), // ~30% conversion
      salesByDate,
      salesByPaymentMethod,
      salesByCategory
    };
  };

  const handleExportReport = () => {
    Swal.fire({
      title: 'ฟังก์ชันนี้ยังไม่พร้อมใช้งาน',
      text: 'ระบบส่งออกรายงานอยู่ระหว่างการพัฒนา',
      icon: 'info',
      confirmButtonColor: '#3085d6',
    });
  };

  const handleDateRangeChange = () => {
    if (!dateRange.from || !dateRange.to) {
      Swal.fire({
        title: 'กรุณาระบุช่วงวันที่',
        text: 'กรุณาระบุวันที่เริ่มต้นและวันที่สิ้นสุด',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (new Date(dateRange.from) > new Date(dateRange.to)) {
      Swal.fire({
        title: 'ช่วงวันที่ไม่ถูกต้อง',
        text: 'วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // Set custom timeframe and load data
    setTimeFrame('custom');
    loadSalesData();
  };

  // Simplified chart representation using HTML/CSS
  const renderChart = () => {
    const maxSales = Math.max(...salesData.salesByDate.map(item => item.sales));
    
    return (
      <div className="mt-4">
        <div className="flex h-64 items-end space-x-2 border-b border-l relative">
          {salesData.salesByDate.map((item, index) => {
            const height = (item.sales / maxSales) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 hover:bg-blue-600 transition-all rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${item.label}: ฿${item.sales.toLocaleString()}`}
                ></div>
                <div className="text-xs mt-1 transform -rotate-45 origin-top-left absolute bottom-0 translate-y-6" style={{ left: `${(100 / salesData.salesByDate.length) * (index + 0.5)}%` }}>
                  {item.label}
                </div>
              </div>
            );
          })}
          <div className="absolute -left-10 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>฿{maxSales.toLocaleString()}</span>
            <span>฿{Math.round(maxSales * 0.75).toLocaleString()}</span>
            <span>฿{Math.round(maxSales * 0.5).toLocaleString()}</span>
            <span>฿{Math.round(maxSales * 0.25).toLocaleString()}</span>
            <span>฿0</span>
          </div>
        </div>
        <div className="h-16"></div> {/* Space for x-axis labels */}
      </div>
    );
  };

  // Render payment methods and category pie charts as simple tables for now
  const renderDistributionTable = (data, title) => {
    const total = data.reduce((sum, item) => sum + item.sales, 0);
    
    return (
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-3">{title}</h3>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left">หมวดหมู่</th>
              <th className="py-2 px-4 text-right">ยอดขาย</th>
              <th className="py-2 px-4 text-right">สัดส่วน</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{item.label || item.category}</td>
                <td className="py-2 px-4 text-right">฿{item.sales.toLocaleString()}</td>
                <td className="py-2 px-4 text-right">
                  <div className="flex items-center justify-end">
                    <div className="w-20 h-4 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-4 bg-blue-500 rounded-full" 
                        style={{ width: `${(item.sales / total) * 100}%` }}
                      ></div>
                    </div>
                    {Math.round((item.sales / total) * 100)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">รายงานยอดขาย</h2>
        <button
          onClick={handleExportReport}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Download size={18} className="mr-2" />
          ส่งออกรายงาน
        </button>
      </div>

      {/* Date filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border rounded-md w-full appearance-none"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="daily">รายวัน</option>
            <option value="weekly">รายสัปดาห์</option>
            <option value="monthly">รายเดือน</option>
            <option value="yearly">รายปี</option>
            {timeFrame === 'custom' && <option value="custom">กำหนดเอง</option>}
          </select>
        </div>
        
        <div className="md:col-span-3">
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
        
        <div className="md:col-span-3">
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

        <div className="md:col-span-3">
          <button
            onClick={handleDateRangeChange}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full"
          >
            ค้นหา
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
      ) : (
        <>
          {/* Sales summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">ยอดขายรวม</p>
                  <p className="text-2xl font-bold">฿{salesData.totalSales.toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-2">
                  <DollarSign size={24} className="text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">จำนวนคำสั่งซื้อ</p>
                  <p className="text-2xl font-bold">{salesData.totalOrders.toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-green-100 p-2">
                  <ShoppingBag size={24} className="text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">มูลค่าเฉลี่ยต่อคำสั่งซื้อ</p>
                  <p className="text-2xl font-bold">฿{salesData.averageOrderValue.toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-purple-100 p-2">
                  <TrendingUp size={24} className="text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">อัตราการซื้อสินค้า</p>
                  <p className="text-2xl font-bold">{salesData.conversionRate}%</p>
                </div>
                <div className="rounded-full bg-yellow-100 p-2">
                  <Users size={24} className="text-yellow-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Sales trend chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold text-lg mb-3">แนวโน้มยอดขาย</h3>
            {renderChart()}
          </div>

          {/* Distribution tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              {renderDistributionTable(salesData.salesByPaymentMethod, 'ยอดขายตามวิธีการชำระเงิน')}
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              {renderDistributionTable(salesData.salesByCategory, 'ยอดขายตามหมวดหมู่')}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesReport;