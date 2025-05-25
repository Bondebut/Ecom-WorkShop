import React, { useState, useEffect } from "react";
import { createCategory } from "../../api/Category";
import useEcomStore from "../../store/ecom-store";
import useDataStore from "../../store/data-store";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2, FiSearch } from "react-icons/fi"; // เพิ่ม FiSearch

const FromCategory = () => {
  const token = useEcomStore((state) => state.token);
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // เพิ่ม state สำหรับค้นหา

  // Get categories and methods from data store
  const { categories, getCategories, addCategory, removeCategory } =
    useDataStore();

  useEffect(() => {
    getCategories(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      return toast.warning("Please fill data");
    }
    try {
      const res = await createCategory(token, { name });
      // Update store directly instead of refetching
      addCategory(res.data);
      toast.success(`Add Category ${res.data.name} Success!`);
      setName("");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Confirm Delete")) return;

    try {
      // removeCategory already handles the optimistic UI update
      const res = await removeCategory(token, id);
      // Don't call removeCategory again here
      toast.success(`Deleted ${res.data.category.name} success`);
    } catch (err) {
      // Error handling - UI already reverted in the store
      const errMsg = err.response?.data?.message || "Failed to delete category";
      toast.error(errMsg);
    }
  };

  // กรองหมวดหมู่ตามคำค้นหา
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Category Management</h1>
      
      {/* Form Section */}
      <div className="bg-gray-50 p-5 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Add New Category</h2>
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter category name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <FiPlus className="mr-2" /> Add Category
          </button>
        </form>
      </div>
      
      {/* Search Section - เพิ่มส่วนค้นหา */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Categories List */}
      <div className="bg-white rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Categories List</h2>
        
        {filteredCategories.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center bg-gray-50 rounded-lg">
            {searchTerm ? "No categories matching your search." : "No categories found. Add your first category above."}
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {filteredCategories.map((item, index) => (
              <li 
                key={index} 
                className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <span className="text-gray-800 font-medium">{item.name}</span>
                <button
                  onClick={() => handleRemove(item._id || item.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <FiTrash2 className="mr-1" /> Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Stats Section */}
      <div className="mt-6 text-gray-600 text-sm flex justify-between">
        <span>
          Showing: <span className="font-semibold">{filteredCategories.length}</span> of <span className="font-semibold">{categories.length}</span> categories
        </span>
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="text-blue-500 hover:text-blue-700"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );
};

export default FromCategory;