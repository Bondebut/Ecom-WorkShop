import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { detailProduct, updateProduct } from "../../../api/Product";
import {
  Edit,
  Save,
  ArrowLeft,
  Trash2,
  Image,
  DollarSign,
  Package,
  Tag,
  Calendar,
  Check,
  X,
} from "lucide-react";
import useEcomStore from "../../../store/ecom-store";
import Swal from "sweetalert2";

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const token = useEcomStore((state) => state.token);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // console.log("Fetching product details for ID:", id);
      const { data } = await detailProduct(token, id);

      // Ensure data has all required properties with defaults
      const productWithDefaults = {
        id: data?.id || 0,
        title: data?.title || "ไม่มีชื่อสินค้า",
        description: data?.description || "",
        price: data?.price || 0,
        sold: data?.sold || 0,
        quantity: data?.quantity || 0,
        createdAt: data?.createdAt || new Date().toISOString(),
        updatedAt: data?.updatedAt || new Date().toISOString(),
        categoryId: data?.categoryId,
        category: data?.category || { name: "ไม่มีหมวดหมู่" },
        images: data?.images || [],
      };
      setProduct(productWithDefaults);
      setEditedProduct(productWithDefaults);
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลสินค้าได้",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes
      setEditedProduct(product);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      // Here you would implement the API call to update the product
      console.log(editedProduct)
      await updateProduct(token, id, editedProduct);

      setProduct(editedProduct);
      setIsEditing(false);

      Swal.fire({
        title: "บันทึกสำเร็จ",
        text: "ข้อมูลสินค้าถูกอัพเดทเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      console.error("Error updating product:", err);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลสินค้าได้",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    Swal.fire({
      title: "ยืนยันการลบสินค้า",
      text: "คุณต้องการลบสินค้านี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบสินค้า",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          // Here you would implement the API call to delete the product
          // For example: await deleteProduct(id);

          // For now, we'll just simulate the deletion
          await new Promise((resolve) => setTimeout(resolve, 800));

          Swal.fire({
            title: "ลบสินค้าสำเร็จ",
            text: "สินค้าถูกลบออกจากระบบเรียบร้อยแล้ว",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });

          // Navigate back to product list
          navigate("/admin/product");
        } catch (err) {
          console.error("Error deleting product:", err);
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบสินค้าได้",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const formatDate = (dateString) => {
    try {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("th-TH", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "ไม่พบข้อมูลวันที่";
    }
  };

  if (loading && !product) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button
          onClick={() => navigate("/admin/product")}
          className="mt-2 text-red-800 underline"
        >
          กลับไปหน้ารายการสินค้า
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin/product")}
            className="mr-3 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">รายละเอียดสินค้า</h1>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleEditToggle}
                className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                disabled={loading}
              >
                <X size={18} className="mr-1" /> ยกเลิก
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                disabled={loading}
              >
                <Save size={18} className="mr-1" /> บันทึก
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDeleteProduct}
                className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={loading}
              >
                <Trash2 size={18} className="mr-1" /> ลบสินค้า
              </button>
              <button
                onClick={handleEditToggle}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                <Edit size={18} className="mr-1" /> แก้ไข
              </button>
            </>
          )}
        </div>
      </div>

      {product && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product Images */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-3 flex items-center">
                  <Image size={18} className="mr-2 text-gray-500" />{" "}
                  รูปภาพสินค้า
                </h2>
                <div className="border rounded-lg p-2 bg-gray-50">
                  {product.images && product.images.length > 0 ? (
                    <div>
                      <img
                        src={product.images[0]?.secure_url}
                        alt={product.title}
                        className="w-full h-auto object-contain rounded"
                      />
                      {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {product.images.slice(1).map((image, index) => (
                            <img
                              key={image?.id || index}
                              src={image?.secure_url}
                              alt={`${product.title} ${index + 2}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-100 text-gray-400">
                      <p>ไม่มีรูปภาพ</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-3 flex items-center">
                  <Calendar size={18} className="mr-2 text-gray-500" />{" "}
                  ข้อมูลเพิ่มเติม
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-2">
                    <span className="text-gray-500 text-sm">รหัสสินค้า:</span>
                    <span className="ml-2 font-medium">
                      {product?.id || "ไม่มีข้อมูล"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-500 text-sm">สร้างเมื่อ:</span>
                    <span className="ml-2">
                      {product?.createdAt
                        ? formatDate(product.createdAt)
                        : "ไม่มีข้อมูล"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-500 text-sm">แก้ไขล่าสุด:</span>
                    <span className="ml-2">
                      {product?.updatedAt
                        ? formatDate(product.updatedAt)
                        : "ไม่มีข้อมูล"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">ยอดขาย:</span>
                    <span className="ml-2">{product?.sold || 0} ชิ้น</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="md:col-span-2">
              {isEditing ? (
                // Edit Mode
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อสินค้า <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editedProduct.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      รายละเอียดสินค้า
                    </label>
                    <textarea
                      name="description"
                      value={editedProduct.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      rows="6"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ราคา (บาท) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="price"
                          value={editedProduct.price}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border rounded-md"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        จำนวนในคลัง <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Package size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="quantity"
                          value={editedProduct.quantity}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border rounded-md"
                          min="0"
                          step="1"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หมวดหมู่ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={editedProduct.category?.name || ""}
                        className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      การเปลี่ยนหมวดหมู่สามารถทำได้ในหน้าแก้ไขสินค้าขั้นสูง
                    </p>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    {product?.title || "ไม่มีชื่อสินค้า"}
                  </h2>

                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {product.category?.name || "ไม่มีหมวดหมู่"}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600 text-sm">
                      รหัสสินค้า: {product?.id || "ไม่มีข้อมูล"}
                    </span>
                  </div>

                  <div className="flex items-center mb-6">
                    <DollarSign size={20} className="text-green-500 mr-1" />
                    <span className="text-2xl font-bold text-green-600">
                      ฿{(product?.price || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      รายละเอียดสินค้า
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                      {product?.description || "ไม่มีรายละเอียดสินค้า"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Package size={18} className="text-blue-500 mr-2" />
                        <h3 className="font-medium">สินค้าในคลัง</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {product?.quantity || 0}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">ชิ้น</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Tag size={18} className="text-purple-500 mr-2" />
                        <h3 className="font-medium">ยอดขายทั้งหมด</h3>
                      </div>
                      <p className="text-2xl font-bold text-purple-700">
                        {product?.sold || 0}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">ชิ้น</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium mb-3">สถานะสินค้า</h3>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          (product?.quantity || 0) > 0
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span
                        className={
                          (product?.quantity || 0) > 0
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        {(product?.quantity || 0) > 0
                          ? "มีสินค้า"
                          : "สินค้าหมด"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">กำลังดำเนินการ...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProduct;
