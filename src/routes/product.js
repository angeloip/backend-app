const { Router } = require("express");
const productController = require("../controllers/product");
const multer = require("../middlewares/multer");
const upload = require("../middlewares/upload");
const router = Router();

router.post("/test", multer, upload, productController.test);
router.get("/:id", productController.getProduct);
router.get("/", productController.getProducts);
router.post("/", multer, upload, productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.patch("/image/:id", multer, upload, productController.updatePicture);
router.delete("/:id", productController.deleteProduct);
router.get("/export/excel", productController.exportExcel);

module.exports = router;
