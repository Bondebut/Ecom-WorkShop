import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, AlertTriangle, ShoppingCart, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import Swal from 'sweetalert2';

const ProductStats = () => {
  const [loading, setLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [productStats, setProductStats] = useState({
    topSellingProducts: [],
    lowStockProducts: [],
    productPerformance: [],
    categories: []
  });

  useEffect(() => {
    loadProductStats();
  }, [timeFrame, categoryFilter]);

  const loadProductStats = async () => {
    setLoading(true);
    try {
      // In a real app, you would call an API with the timeframe and category
      // const response = await getProductStats(timeFrame, categoryFilter);
      // setProductStats(response.data);
      
      // Generate mock data
      setTimeout(() => {
        const mockData = generateMockData();
        setProductStats(mockData);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load product stats:', error);
      setLoading(false);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลสถิติสินค้าได้',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const generateMockData = () => {
    // Mock categories
    const categories = [
      'อิเล็กทรอนิกส์',
      'เสื้อผ้า',
      'เครื่องใช้ในบ้าน',
      'อาหารและเครื่องดื่ม',
      'ความงามและสุขภาพ'
    ];
    
    // Mock top selling products
    const topSellingProducts = [
      { id: 'P001', name: 'สมาร์ทโฟน XYZ รุ่นล่าสุด', category: 'อิเล็กทรอนิกส์', sales: 120, revenue: 1800000 },
      { id: 'P002', name: 'เสื้อยืดคอกลม สีขาว', category: 'เสื้อผ้า', sales: 250, revenue: 75000 },
      { id: 'P003', name: 'หูฟังไร้สาย Bluetooth', category: 'อิเล็กทรอนิกส์', sales: 180, revenue: 450000 },
      { id: 'P004', name: 'หม้อทอดไร้น้ำมัน 3.5 ลิตร', category: 'เครื่องใช้ในบ้าน', sales: 95, revenue: 285000 },
      { id: 'P005', name: 'ครีมบำรุงผิวหน้า สูตรเข้มข้น', category: 'ความงามและสุขภาพ', sales: 150, revenue: 225000 },
      { id: 'P006', name: 'เครื่องทำกาแฟแคปซูล', category: 'เครื่องใช้ในบ้าน', sales: 75, revenue: 337500 },
      { id: 'P007', name: 'กางเกงขายาว ทรงกระบอก', category: 'เสื้อผ้า', sales: 130, revenue: 91000 },
      { id: 'P008', name: 'เครื่องวัดความดันโลหิต อัตโนมัติ', category: 'ความงามและสุขภาพ', sales: 60, revenue: 120000 },
    ];
    
    // Mock low stock products
    const lowStockProducts = [
      { id: 'P003', name: 'หูฟังไร้สาย Bluetooth', category: 'อิเล็กทรอนิกส์', stock: 5, threshold: 10 },
      { id: 'P006', name: 'เครื่องทำกาแฟแคปซูล', category: 'เครื่องใช้ในบ้าน', stock: 3, threshold: 15 },
      { id: 'P009', name: 'แท็บเล็ต 10 นิ้ว', category: 'อิเล็กทรอนิกส์', stock: 2, threshold: 8 },
      { id: 'P010', name: 'น้ำหอม กลิ่นดอกไม้', category: 'ความงามและสุขภาพ', stock: 7, threshold: 20 },
    ];
    
    // Mock product performance (views, conversion, etc)
    const productPerformance = [
      { 
        id: 'P001', 
        name: 'สมาร์ทโฟน XYZ รุ่นล่าสุด', 
        category: 'อิเล็กทรอนิกส์', 
        views: 5200, 
        sales: 120, 
        conversionRate: 2.31,
        trend: 'up'
      },
      { 
        id: 'P002', 
        name: 'เสื้อยืดคอกลม สีขาว', 
        category: 'เสื้อผ้า', 
        views: 3800, 
        sales: 250, 
        conversionRate: 6.58,
        trend: 'up'
      },
      { 
        id: 'P003', 
        name: 'หูฟังไร้สาย Bluetooth', 
        category: 'อิเล็กทรอนิกส์', 
        views: 4100, 
        sales: 180, 
        conversionRate: 4.39,
        trend: 'down'
      },
      { 
        id: 'P004', 
        name: 'หม้อทอดไร้น้ำมัน 3.5 ลิตร', 
        category: 'เครื่องใช้ในบ้าน', 
        views: 2900, 
        sales: 95, 
        conversionRate: 3.28,
        trend: 'up'
      },
      { 
        id: 'P005', 
        name: 'ครีมบำรุงผิวหน้า สูตรเข้มข้น', 
        category: 'ความงามและสุขภาพ', 
        views: 3200, 
        sales: 150, 
        conversionRate: 4.69,
        trend: 'down'
      },
    ];
    
    // Filter by category if needed
    const filteredTopSelling = categoryFilter === 'all' 
      ? topSellingProducts 
      : topSellingProducts.filter(p => p.category === categoryFilter);
      
    const filteredLowStock = categoryFilter === 'all'
      ? lowStockProducts
      : lowStockProducts.filter(p => p.category === categoryFilter);
      
    const filteredPerformance = categoryFilter === 'all'
      ? productPerformance
      : productPerformance.filter(p => p.category === categoryFilter);
    
    return {
      topSellingProducts: filteredTopSelling,
      lowStockProducts: filteredLowStock,
      productPerformance: filteredPerformance,
      categories
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

  // Search functionality
  const searchProducts = (products) => {
    if (!searchTerm) return products;
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">สถิติสินค้า</h2>
        <button
          onClick={handleExportReport}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Download size={18} className="mr-2" />
          ส่งออกรายงาน
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border rounded-md w-full appearance-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">ทุกหมวดหมู่</option>
            {productStats.categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border rounded-md w-full appearance-none"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="weekly">รายสัปดาห์</option>
            <option value="monthly">รายเดือน</option>
            <option value="yearly">รายปี</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
      ) : (
        <>
          {/* Top selling products */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold text-lg mb-3">สินค้าขายดี</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left">รหัสสินค้า</th>
                    <th className="py-2 px-4 text-left">ชื่อสินค้า</th>
                    <th className="py-2 px-4 text-left">หมวดหมู่</th>
                    <th className="py-2 px-4 text-right">จำนวนขาย</th>
                    <th className="py-2 px-4 text-right">ยอดขาย</th>
                  </tr>
                </thead>
                <tbody>
                  {searchProducts(productStats.topSellingProducts).map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium">{product.id}</td>
                      <td className="py-2 px-4">{product.name}</td>
                      <td className="py-2 px-4">{product.category}</td>
                      <td className="py-2 px-4 text-right">{product.sales.toLocaleString()} ชิ้น</td>
                      <td className="py-2 px-4 text-right">฿{product.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Product performance (conversion rates) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-3">ประสิทธิภาพสินค้า</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-4 text-left">ชื่อสินค้า</th>
                      <th className="py-2 px-4 text-right">การเข้าชม</th>
                      <th className="py-2 px-4 text-right">การซื้อ</th>
                      <th className="py-2 px-4 text-right">อัตราการซื้อ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchProducts(productStats.productPerformance).map((product, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{product.name}</td>
                        <td className="py-2 px-4 text-right">
                          <div className="flex items-center justify-end">
                            <Eye size={16} className="text-gray-500 mr-1" />
                            {product.views.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <div className="flex items-center justify-end">
                            <ShoppingCart size={16} className="text-gray-500 mr-1" />
                            {product.sales.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <div className="flex items-center justify-end">
                            {product.trend === 'up' ? (
                              <TrendingUp size={16} className="text-green-500 mr-1" />
                            ) : (
                              <TrendingDown size={16} className="text-red-500 mr-1" />
                            )}
                            {product.conversionRate.toFixed(2)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low stock alert */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-3">แจ้งเตือนสินค้าใกล้หมด</h3>
              {productStats.lowStockProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left">รหัสสินค้า</th>
                        <th className="py-2 px-4 text-left">ชื่อสินค้า</th>
                        <th className="py-2 px-4 text-right">คงเหลือ</th>
                        <th className="py-2 px-4 text-right">ขั้นต่ำ</th>
                        <th className="py-2 px-4 text-center">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchProducts(productStats.lowStockProducts).map((product, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4 font-medium">{product.id}</td>
                          <td className="py-2 px-4">{product.name}</td>
                          <td className="py-2 px-4 text-right">{product.stock}</td>
                          <td className="py-2 px-4 text-right">{product.threshold}</td>
                          <td className="py-2 px-4 text-center">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs ${
                                product.stock === 0 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              <div className="flex items-center justify-center">
                                <AlertTriangle size={14} className="mr-1" />
                                {product.stock === 0 ? 'หมดสต๊อก' : 'ใกล้หมด'}
                              </div>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  ไม่พบสินค้าที่ใกล้หมด
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductStats;