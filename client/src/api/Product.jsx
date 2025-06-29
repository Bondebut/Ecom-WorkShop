import axios from "axios";

export const createProduct = async (token, productData) => {
  return await axios.post(
    `${import.meta.env.VITE_API_URL}/product`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const listProduct = async (dataInput) => {
  return await axios.post(`${import.meta.env.VITE_API_URL}/products/filter`, dataInput);
};

export const removeProduct = async (token, id) => {
  return await axios.delete(`${import.meta.env.VITE_API_URL}/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const detailProduct = async (id) => {
  console.log("Fetching product details for ID:", id);
  if (!id) {
    throw new Error("Product ID is required");
  }
  return await axios.get(`${import.meta.env.VITE_API_URL}/product/${id}`);
};

export const updateProduct = async (token, id, productData) => {
  if (!id) {
    throw new Error("Product ID is required");
  }
  return await axios.put(
    `${import.meta.env.VITE_API_URL}/product/${id}`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
