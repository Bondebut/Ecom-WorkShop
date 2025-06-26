import React, { useState, useEffect } from "react";
import { listProduct, removeProduct } from "../../../api/Product";
import { Link } from "react-router-dom";
import useEcomStore from "../../../store/ecom-store";
import Swal from "sweetalert2";
// import { DetailProduct } from "./DetailProduct";
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";

// Simple loading components without external dependencies
const LoadingSpinner = ({ text = "กำลังโหลด..." }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-blue-600"></div>
    <p className="mt-3 text-sm text-gray-600 font-medium">{text}</p>
  </div>
);

const CardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="bg-gray-200 h-48"></div>
    <div className="p-4 space-y-3">
      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
      <div className="bg-gray-200 h-6 rounded w-1/4"></div>
    </div>
  </div>
);

const ListProduct = () => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [filters, setFilters] = useState({
    title: "",
    priceRange: [null, null],
  });
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const token = useEcomStore((state) => state.token);

  // Load products
  const loadProducts = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize: pagination.pageSize,
        title: filters.title,
      };

      if (filters.priceRange[0] !== null) {
        params.minPrice = filters.priceRange[0];
      }

      if (filters.priceRange[1] !== null) {
        params.maxPrice = filters.priceRange[1];
      }

      const response = await listProduct(params);

      setProducts(response.data.data);
      setPagination({
        ...pagination,
        current: page,
        total: response.data.meta.totalCount,
      });
    } catch (error) {
      console.error("Failed to load products:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถโหลดข้อมูลสินค้าได้",
        icon: "error",
        confirmButtonColor: "#3085d6",
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
      title: "",
      priceRange: [null, null],
    });
    loadProducts(1, { title: "", priceRange: [null, null] });
  };

  // Handle delete
  const handleRemove = async (id, title) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ",
      text: `คุณต้องการลบสินค้า "${title}" หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await removeProduct(token, id);

      Swal.fire({
        title: "สำเร็จ",
        text: "ลบสินค้าสำเร็จ",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      loadProducts(pagination.current, filters);
    } catch (error) {
      console.error("Failed to delete product:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถลบสินค้าได้",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
    }
  };

  // Detail product
  const detailProduct = (id) => {
    try {
    } catch (error) {
      console.error("Failed to load product details:", error);
    }
  };

  // Product Grid Component
  const ProductGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        [...Array(8)].map((_, i) => <CardSkeleton key={i} />)
      ) : products.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            ไม่พบสินค้า
          </h3>
          <p className="text-gray-400">ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
        </div>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <img
                src={
                  product.images && product.images.length > 0
                    ? product.images[0].url
                    : "https://via.placeholder.com/300x200"
                }
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <Link
                    to={`/admin/product/${product.id}`}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Edit3 size={16} className="text-blue-600" />
                    <span className="ml-1 text-blue-600 text-xs">แก้ไข</span>
                  </Link>
                  <button
                    onClick={() => handleRemove(product.id, product.title)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Stock Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.quantity > 10
                      ? "bg-green-100 text-green-800"
                      : product.quantity > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.quantity > 0 ? `คลัง: ${product.quantity}` : "หมด"}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">
                  ฿{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  {product.category?.name || "ไม่มีหมวดหมู่"}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <TrendingUp size={14} className="mr-1" />
                  <span>ขาย: {product.sold || 0}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    {new Date(product.createdAt).toLocaleDateString("th-TH")}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  to={`/admin/product/${product.id}`}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                >
                  แก้ไข
                </Link>
                <button
                  onClick={() => handleRemove(product.id, product.title)}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Product Table Component
  const ProductTable = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                สินค้า
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ราคา
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                คลัง
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                หมวดหมู่
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ขาย
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">ไม่พบสินค้า</p>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0].url
                            : "https://via.placeholder.com/60x60"
                        }
                        alt={product.title}
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      ฿{product.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.quantity > 10
                          ? "bg-green-100 text-green-800"
                          : product.quantity > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sold || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/product/${product.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => handleRemove(product.id, product.title)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 ">
      {/* Header */}
      {/* <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
            <p className="text-gray-600 mt-1">
              จัดการสินค้าทั้งหมดในร้านของคุณ
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/admin/product/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus size={20} className="mr-2" />
              เพิ่มสินค้าใหม่
            </Link>
          </div>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">สินค้าทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">มีสต็อก</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter((p) => p.quantity > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Package className="text-red-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">หมดสต็อก</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter((p) => p.quantity === 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">มูลค่ารวม</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿
                {products
                  .reduce((sum, p) => sum + p.price * p.quantity, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={filters.title}
                onChange={(e) =>
                  setFilters({ ...filters, title: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
              <input
                type="number"
                placeholder="ราคาต่ำสุด"
                value={
                  filters.priceRange[0] === null ? "" : filters.priceRange[0]
                }
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? null : Number(e.target.value);
                  setFilters({
                    ...filters,
                    priceRange: [value, filters.priceRange[1]],
                  });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <input
                type="number"
                placeholder="ราคาสูงสุด"
                value={
                  filters.priceRange[1] === null ? "" : filters.priceRange[1]
                }
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? null : Number(e.target.value);
                  setFilters({
                    ...filters,
                    priceRange: [filters.priceRange[0], value],
                  });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <Search size={16} className="mr-2" />
              ค้นหา
            </button>
            <button
              onClick={handleResetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              รีเซ็ต
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            แสดง {products.length} จาก {pagination.total} รายการ
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">มุมมอง:</span>
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              ตาราง
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === "table"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              รายการ
            </button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {/* {loading ? <LoadingSpinner text="กำลังโหลดสินค้า..." /> : <ProductGrid /> } */}
      {/* {viewMode === "table" && <ProductTable />} */}
      
      {viewMode === "table" ? <ProductTable /> : <ProductGrid />}
      
      

      {/* Pagination */}
      {pagination.total > pagination.pageSize && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            แสดง {(pagination.current - 1) * pagination.pageSize + 1} ถึง{" "}
            {Math.min(
              pagination.current * pagination.pageSize,
              pagination.total
            )}{" "}
            จาก {pagination.total} รายการ
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className={`px-3 py-2 rounded-lg text-sm ${
                pagination.current === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              ก่อนหน้า
            </button>

            {[
              ...Array(
                Math.min(5, Math.ceil(pagination.total / pagination.pageSize))
              ),
            ].map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    pagination.current === pageNumber
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={
                pagination.current ===
                Math.ceil(pagination.total / pagination.pageSize)
              }
              className={`px-3 py-2 rounded-lg text-sm ${
                pagination.current ===
                Math.ceil(pagination.total / pagination.pageSize)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
