import axios from "axios";

export const uploadImage = async (token, imagesFormData) => {
  return await axios.post(`${import.meta.env.VITE_API_URL}/upload/images`, imagesFormData, {
      headers: {
            Authorization: `Bearer ${token}`
        }
    });
};