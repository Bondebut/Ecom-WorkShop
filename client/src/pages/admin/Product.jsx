import React, { useState } from 'react'
import AddProduct from '../../components/admin/Product/AddProduct'
import ListProduct from '../../components/admin/Product/ListProduct'

const Product = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const openDialog = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6 border-b pb-3">Product Master</h1>
       <div className="flex justify-end mb-8">
        <button 
          onClick={openDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200"
        >
          Add New Product
        </button>
      </div>
      <div className="">
        <ListProduct />
      </div>
      
      {/* Product Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button 
                onClick={closeDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <AddProduct onClose={closeDialog} />
            </div>
          </div>
        </div>
      )}
    </div>
   
  )
}

export default Product