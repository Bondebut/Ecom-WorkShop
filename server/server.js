// Step import
const express = require('express')
const app = express()
const morgan = require('morgan')
//import อ่านdirectory
const { readdirSync } = require('fs')
const cors = require('cors')
// const authRouter = require('./routers/auth')
const uploadRoutes = require('./routes/uploadRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const callOption = {
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    credential: true
}

//middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors(callOption))
app.use('/api/upload', uploadRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
// app._router.stack.forEach((r) => {
//     if (r.route) {
//         console.log(r.route.path, r.route.methods);
//     } else if (r.name === 'router') {
//         r.handle.stack.forEach((r2) => {
//             console.log(r2.route.path, r2.route.methods);
//         });
//     }
// });
