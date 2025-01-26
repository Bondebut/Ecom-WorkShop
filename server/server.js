// Step import
const express = require('express')
const app = express()
const morgan = require('morgan')
//import อ่านdirectory
const { readdirSync } = require('fs')
const cors = require('cors')
// const authRouter = require('./routers/auth')

//middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
// app.use('/api',authRoutes)
//อ่านdirectory
readdirSync('./routes').map((c)=> app.use('/api',require('./routes/'+c)))

//Router
// app.post('/api',(req,res)=>{
//     //code
//     const {username,password} = req.body
//     console.log(username,password)
//     res.send('test test')
// })

//start server
app.listen(5000,()=> console.log('Server is running on port 5000'))
