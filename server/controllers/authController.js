const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    //code
    try {
        //code
        const { email, password } = req.body
        const emailNew = email.toLowerCase().trim()
        //Validate body
        if (!emailNew || !password) {
            //
            return res.status(400).json({ message: "Email or Password is require!!" })
        }
        if (!/\S+@\S+\.\S+/.test(emailNew)) {
            return res.status(400).json({ message: "Invalid email format!" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long!" });
        }

        //check Email in db
        const user = await prisma.user.findFirst({
            where: {
                email: emailNew
            }
        })
        if (user) {
            return res.status(400).json({ message: "Email already exits!!" })
        }

        //hashPass
        const hashPassword = await bcrypt.hash(password, 10)

        //Register
        await prisma.user.create({
            data: {
                email: emailNew,
                password: hashPassword
            }
        })

        res.send('Register Success')
    } catch {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }

}

exports.login = async (req, res) => {
    try {
        //code
        const { email, password } = req.body
        const emailNew = email.toLowerCase().trim()
        if (!/\S+@\S+\.\S+/.test(emailNew)) {
            return res.status(400).json({ message: "Invalid email format!" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long!" });
        }

        //check Email
        const user = await prisma.user.findFirst({
            where: {
                email: emailNew
            }
        })

        if (!user || !user.enable) {
            return res.status(400).json({ messagee: "User Not Found or Not Enable" })
        }
        //check Pass
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Password Invalid!!" })
        }
        //check Payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        
        //Generate Token
        jwt.sign(payload,process.env.SECRET,{expiresIn:'1D'},(err,token)=>{
            if(err){
                return res.status(500).json({ message: "Server error!!"})
            }
            res.json({payload,token})
        })
    } catch {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error!!" })
    }

}

exports.currentUser = async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where:{
                email:req.user.email
            },
            select:{
                id:true,
                email:true,
                name:true,
                role:true
            }
        })
        res.json({user})
    } catch {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

