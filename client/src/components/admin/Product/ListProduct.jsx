import React, { useState, useEffect } from "react";
import { listProduct, removeProduct } from "../../../api/Product";
import { Link } from "react-router-dom";
import useEcomStore from "../../../store/ecom-store";
import Swal from "sweetalert2";

const ListProduct = () => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    title: '',
    priceRange: [null, null] 
  });
  const token = useEcomStore((state) => state.token);
  // Load products
  const loadProducts = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      // สร้าง params object สำหรับส่งไปยัง API
      const params = {
        page,
        pageSize: pagination.pageSize,
        title: filters.title,
      };
      
      // เพิ่ม minPrice เฉพาะเมื่อมีการกำหนดค่า
      if (filters.priceRange[0] !== null) {
        params.minPrice = filters.priceRange[0];
      }
      
      // เพิ่ม maxPrice เฉพาะเมื่อมีการกำหนดค่า
      if (filters.priceRange[1] !== null) {
        params.maxPrice = filters.priceRange[1];
      }
      
      const response = await listProduct(params);
      
      setProducts(response.data.data);
      setPagination({
        ...pagination,
        current: page,
        total: response.data.meta.totalCount
      });
    } catch (error) {
      console.error("Failed to load products:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถโหลดข้อมูลสินค้าได้",
        icon: "error",
        confirmButtonColor: "#3085d6"
      });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(pagination.current, filters);
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    loadProducts(page, filters);
  };

  // Handle search
  const handleSearch = () => {
    loadProducts(1, filters);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      title: '',
      priceRange: [null, null]
    });
    loadProducts(1, { title: '', priceRange: [null, null] });
  };

  // Handle delete
  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบสินค้านี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก"
    });
    if (!result.isConfirmed) return;
    
    setLoading(true);
    try {
      // ใช้ localStorage แทน redux
      await removeProduct(token, id);
      Swal.fire({
        title: "สำเร็จ",
        text: "ลบสินค้าสำเร็จ",
        icon: "success",
        confirmButtonColor: "#3085d6"
      });

      loadProducts(pagination.current, filters);
    } catch (error) {
      console.error("Failed to delete product:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถลบสินค้าได้",
        icon: "error",
        confirmButtonColor: "#3085d6"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Filter Section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">ค้นหาและกรองข้อมูล</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาตามชื่อสินค้า</label>
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={filters.title}
              onChange={(e) => setFilters({...filters, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ช่วงราคา (ไม่ระบุ = ทั้งหมด)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="ราคาต่ำสุด"
                value={filters.priceRange[0] === null ? '' : filters.priceRange[0]}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : Number(e.target.value);
                  setFilters({...filters, priceRange: [value, filters.priceRange[1]]});
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="ราคาสูงสุด"
                value={filters.priceRange[1] === null ? '' : filters.priceRange[1]}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : Number(e.target.value);
                  setFilters({...filters, priceRange: [filters.priceRange[0], value]});
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              ค้นหา
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
            >
              รีเซ็ต
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-lg text-gray-600">ไม่พบข้อมูลสินค้า</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รูปภาพ</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/80'}
                        alt={product.title}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600 font-medium">฿{product.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.category?.name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/admin/product/${product.id}`} className="text-blue-600 hover:text-blue-900">
                          แก้ไข
                        </Link>
                        <button
                          onClick={() => handleRemove(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              แสดง {products.length} จาก {pagination.total} รายการ
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className={`px-3 py-1 rounded ${pagination.current === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                ก่อนหน้า
              </button>
              
              {[...Array(Math.min(5, Math.ceil(pagination.total / pagination.pageSize)))].map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded ${pagination.current === pageNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === Math.ceil(pagination.total / pagination.pageSize)}
                className={`px-3 py-1 rounded ${pagination.current === Math.ceil(pagination.total / pagination.pageSize) ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                ถัดไป
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListProduct;