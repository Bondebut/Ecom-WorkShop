import React, { useState, useEffect } from "react";
import { createCategory, removeCategory } from "../../api/Category";
import useEcomStore from "../../store/ecom-store";
import useDataStore from "../../store/data-store";
import { toast } from "react-toastify";

const FromCategory = () => {
  const token = useEcomStore((state) => state.token);
  const [name, setName] = useState("");

  // Get categories and methods from data store
  const { categories, getCategories } = useDataStore();

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
      // removeCategory now handles both UI update and API call
      const res = await removeCategory(token, id);
      toast.success(`Deleted ${res.data.name} success`);
    } catch (err) {
      // Error handling - UI already reverted in the store
      const errMsg = err.response?.data?.message || "Failed to delete category";
      toast.error(errMsg);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <h1>Category Manage</h1>
      <form className="my-4" onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="border rounded-md mr-4"
        />
        <button className="bg-blue-600">Add Category</button>
      </form>
      <hr />

      <ul className="list-none">
        {categories.map((item, index) => (
          <li className="flex justify-between my-2 " key={index}>
            <span>{item.name}</span>
            <button
              onClick={() => handleRemove(item._id || item.id)}
              className="bg-red-700 px-2 py-4 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FromCategory;
