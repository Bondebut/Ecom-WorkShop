import axios from "axios";

export const uploadImage = async (token, imagesFormData) => {
  return await axios.post('http://localhost:5000/api/upload/images', imagesFormData, {
      headers: {
            Authorization: `Bearer ${token}`
        }
    });
};