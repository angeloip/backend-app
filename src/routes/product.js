const { Router } = require("express");
const productController = require("../controllers/product");
const router = Router();

router.post("/test", productController.test);

module.exports = router;
