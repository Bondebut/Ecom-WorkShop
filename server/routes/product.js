const express = require("express");
const router = express.Router();
const {
  create,
  list,
  read,
  update,
  remove,
  listby,
  searchfillters,
} = require("../controllers/productController");
const { authCheck, adminCheck } = require('../middlewares/authCheck')
//@ENDPIONT http://localhost:500/api/product

router.post("/product", authCheck, adminCheck, create);
router.get("/products", list);
router.get("/product/:id", read);
router.put("/product/:id", authCheck, adminCheck, update);
router.delete("/product/:id", authCheck, adminCheck, remove);
router.post("/productby", listby);
router.post("/search/fillters", searchfillters);

module.exports = router;
