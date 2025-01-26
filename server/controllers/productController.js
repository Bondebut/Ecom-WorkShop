const { query } = require("express")
const prisma = require("../config/prisma")


exports.create = async (req, res) => {
    try {
        //code
        const { title, description, price, quantity, categoryId, images } = req.body
        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }
            }
        })
        res.send(product)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}
exports.list = async (req, res) => {
    try {
        //code
        const { count } = req.params
        const product = await prisma.product.findMany({
            take: parseInt(count),
            orderBy: { createedAt: "desc" },
            include: {
                category: true,
                images: true
            }
        })
        res.send(product)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}
exports.read = async (req, res) => {
    try {
        //code
        const { id } = req.params
        const product = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(product)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}
exports.update = async (req, res) => {
    try {
        //code
        const { title, description, price, quantity, categoryId, images } = req.body
        const pamid = req.params.id

        //clear image
        await prisma.image.deleteMany({
            where: {
                productId: Number(pamid)
            }
        })


        const product = await prisma.product.update({
            where: {
                id: Number(pamid)
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }
            }
        })
        res.send(product)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}
exports.remove = async (req, res) => {
    try {
        //code
        const { id } = req.params
        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        })
        res.send("Delete Success")
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}
exports.listby = async (req, res) => {
    try {
        //code
        const { sort, order, limit } = req.body
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: {
                [sort]: order
            },
            include: {
                category: true
            }
        })
        res.send(products)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

const hdlQuery = async (req, res, query) => {
    try {
        //code
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query,
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Search error" })
    }
}

const hdlPrice = async (req, res, priceRange) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.json(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error!!" })
    }
}

const hdlCategory = async (req,res,categoryId) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId: {
                    in:categoryId.map((id)=>Number(id))
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.json(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error!!" })
    }
}


exports.searchfillters = async (req, res) => {
    try {
        //code
        const { query, category, price } = req.body
        if (query) {
            console.log('query : ', query)
            await hdlQuery(req, res, query)
        }
        if (category) {
            console.log('category : ', category)
            await hdlCategory(req,res,category)
        }
        if (price) {
            console.log('price : ', price)
            await hdlPrice(req, res, price)
        }
        // res.send("searchfillters")
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}