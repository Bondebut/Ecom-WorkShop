//import
const express = require('express')
const router = express.Router()
//import Controller
const { register, login, currentUser } = require('../controllers/authController')
const { authCheck, adminCheck } = require('../middlewares/authCheck')

//@ENDPoint http://localhost:5000/api/
router.post('/register', register)
router.post('/login', login)
router.post('/current-user',authCheck, currentUser)
router.post('/current-admin',authCheck,adminCheck, currentUser)





module.exports = router