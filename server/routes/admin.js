//import
const express = require('express')
const router = express.Router()
const { authCheck, adminCheck } = require('../middlewares/authCheck')
//import Controller
const { getOrderAdmin, changeOrderStatus } = require('../controllers/adminController')


//@ENDPoint http://localhost:5000/api/
router.put('/admin/order-status', authCheck, changeOrderStatus)
router.get('/admin/orders', authCheck, getOrderAdmin)





module.exports = router