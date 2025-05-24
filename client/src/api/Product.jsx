import axios from "axios";

export const createProduct = async (token, productData) => {
  return await axios.post('http://localhost:5000/api/product', productData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const listProduct = async (params = {}) => {
  const { page = 1, pageSize = 10, title = '', minPrice, maxPrice } = params;
  
  let url = `http://localhost:5000/api/products?page=${page}&pageSize=${pageSize}`;
  
  if (title) url += `&title=${encodeURIComponent(title)}`;
  if (minPrice) url += `&minPrice=${minPrice}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;
  
  return await axios.get(url);
}

export const removeProduct = async (token,id) => {
    return await axios.delete('http://localhost:5000/api/product/'+id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}