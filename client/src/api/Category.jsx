import axios from "axios";


export const createCategory = async (token, form) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/category`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const listCategory = async (token) => {
    return axios.get(`${import.meta.env.VITE_API_URL}/category`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const removeCategory = async (token,id) => {
    return axios.delete(`${import.meta.env.VITE_API_URL}/category/`+id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}