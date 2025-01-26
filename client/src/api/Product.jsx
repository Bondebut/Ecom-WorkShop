import axios from "axios";

export const createProduct = async (token, form) => {
    return axios.post('http://localhost:5000/api/product', form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listProduct = async (token) => {
    return axios.get('http://localhost:5000/api/product', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const removeProduct = async (token,id) => {
    return axios.delete('http://localhost:5000/api/product/'+id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}