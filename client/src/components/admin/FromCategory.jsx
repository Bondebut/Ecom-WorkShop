import React, { useState, useEffect } from 'react'
import { createCategory, listCategory, removeCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'


const FromCategory = () => {

    const token = useEcomStore((state) => state.token)
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])

    useEffect(() => {
        getCategory(token)
    }, [])

    const getCategory = async( token) => {

        try {
            const res = await listCategory(token)
            setCategories(res.data)
        } catch (err) {
            const errMsg = err.response?.data?.message
            toast.error(errMsg)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name) {
            return toast.warning('Please fill data')
        }
        try {
            const res = await createCategory(token, { name })
            console.log(res.data.name)
            toast.success(`Add Category ${res.data.name} Success!`)
            getCategory(token)
        } catch (err) {
            const errMsg = err.response?.data?.message
            toast.error(errMsg)
        }
    }

    const handleRemove = async (id) => {
        try {
            
            const confirmed = confirm('Confirm Delete')
            if(confirmed){
                const res = await removeCategory(token, id)
                toast.success(`Deleted ${res.data.name} success`)
                getCategory(token)
            }
        } catch (err) {
            const errMsg = err.response?.data?.message
            toast.error(errMsg)
        }
    }

    return (
        <div className='container mx-auto p-4 bg-white shadow-md' >
            <h1>Category Manage</h1>
            <form className='my-4' onSubmit={handleSubmit} >
                <input onChange={(e) => setName(e.target.value)} type="text" className='border rounded-md mr-4' />
                <button className='bg-blue-600'>Add Category</button>
            </form>
            <hr />

            <ul className='list-none'>
                {
                    categories.map((item, index) =>
                        <li className='flex justify-between my-2 ' key={index}><span>{item.name}</span>
                            <button onClick={() => handleRemove(item.id)} className='bg-red-700 px-2 py-4 rounded'>Delete</button></li>

                    )
                }

            </ul>
        </div>
    )
}

export default FromCategory