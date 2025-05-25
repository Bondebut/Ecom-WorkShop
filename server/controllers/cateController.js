const prisma = require("../config/prisma")


exports.create = async (req, res) => {
    try {
        //code
        const { name } = req.body
        const category = await prisma.category.create({
            data: {
                name: name
            }
        })
        res.send(category)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}
exports.list = async (req, res) => {
    try {
        //code 
        const category = await prisma.category.findMany()
        res.send(category)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}
exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const categoryId = Number(id)
         // ตรวจสอบว่ามีหมวดหมู่ "ไม่มีหมวดหมู่" หรือไม่
        let defaultCategory = await prisma.category.findFirst({
            where: { name: "ไม่มีหมวดหมู่" }
        })
        
        // ถ้าไม่มีหมวดหมู่ "ไม่มีหมวดหมู่" ให้สร้างใหม่
        if (!defaultCategory) {
            defaultCategory = await prisma.category.create({
                data: { name: "ไม่มีหมวดหมู่" }
            })
        }
        
        // ย้ายผลิตภัณฑ์ทั้งหมดในหมวดหมู่นี้ไปยังหมวดหมู่ "ไม่มีหมวดหมู่"
        await prisma.product.updateMany({
            where: { categoryId: categoryId },
            data: { categoryId: defaultCategory.id }
        })
        
        // ลบหมวดหมู่
        const category = await prisma.category.delete({
            where: { id: categoryId }
        })
        
        res.send({ 
            message: `Category deleted successfully. All products moved to "${defaultCategory.name}" category.`,
            category 
        })
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}