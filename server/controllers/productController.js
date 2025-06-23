const { query } = require("express");
const prisma = require("../config/prisma");
const { cloudinary } = require("../config/cloudinary");

exports.create = async (req, res) => {
  try {
    //code
    console.log("req.body", req.body);
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    // console.log("image",images)
    // ตรวจสอบว่ามีข้อมูลรูปภาพหรือไม่
    const processedImages = images.map((item) => ({
      asset_id: item.asset_id,
      public_id: item.public_id || item.asset_id, 
      url: item.url,
      secure_url: item.secure_url,
    }));

    const product = await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: processedImages,
        },
      },
    });
    res.send(product);
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.list = async (req, res) => {
  try {
    // Get query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const title = req.query.title || "";
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice)
      : undefined;

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where = {};

    // Add title filter if provided
    if (title) {
      where.title = {
        contains: title,
      };
    }

    // Add price range filter if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};

      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where });

    // Get products with filters and pagination
    const products = await prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    });

    // Return products with pagination metadata
    res.json({
      data: products,
      meta: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.read = async (req, res) => {
  try {
    //code
    const { id } = req.params;
    console.log("id", id);
    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(product);
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.update = async (req, res) => {
  try {
    //code
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    const pamid = req.params.id;

    //clear image
    await prisma.image.deleteMany({
      where: {
        productId: Number(pamid),
      },
    });

    const product = await prisma.product.update({
      where: {
        id: Number(pamid),
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
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(product);
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.remove = async (req, res) => {
  try {
    //code
    const { id } = req.params;
    // 1. ดึงข้อมูลรูปภาพก่อนที่จะลบ
    const images = await prisma.image.findMany({
      where: {
        productId: Number(id),
      },
      select: {
        public_id: true,
      },
    });

    // 2. ลบรูปภาพจาก Cloudinary
    for (const image of images) {
      if (image.public_id) {
        try {
          await cloudinary.uploader.destroy(image.public_id);
          console.log(`Deleted image from Cloudinary: ${image.public_id}`);
        } catch (cloudinaryError) {
          console.log(
            `Failed to delete image from Cloudinary: ${image.public_id}`,
            cloudinaryError
          );
          // ไม่ต้อง throw error เพื่อให้ทำงานต่อได้แม้ลบไฟล์ใน Cloudinary ไม่สำเร็จ
        }
      }
    }

    // 3. ลบข้อมูลรูปภาพในฐานข้อมูล
    await prisma.image.deleteMany({
      where: {
        productId: Number(id),
      },
    });

    // 4. ลบข้อมูลสินค้า
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
    // 5. ส่ง response กลับ
    res.send("Delete Success");
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.listby = async (req, res) => {
  try {
    //code
    const { sort, order, limit } = req.body;
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: {
        [sort]: order,
      },
      include: {
        category: true,
      },
    });
    res.send(products);
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const hdlQuery = async (req, res, query) => {
  try {
    //code
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Search error" });
  }
};

const hdlPrice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0],
          lte: priceRange[1],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error!!" });
  }
};

const hdlCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => Number(id)),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error!!" });
  }
};

exports.searchfillters = async (req, res) => {
  try {
    //code
    const { query, category, price } = req.body;
    if (query) {
      console.log("query : ", query);
      await hdlQuery(req, res, query);
    }
    if (category) {
      console.log("category : ", category);
      await hdlCategory(req, res, category);
    }
    if (price) {
      console.log("price : ", price);
      await hdlPrice(req, res, price);
    }
    // res.send("searchfillters")
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
