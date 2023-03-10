const { Router } = require("express");
const productController = require("../controllers/product");
const multer = require("../middlewares/multer");
const multerExcel = require("../middlewares/multerExcel");
const upload = require("../middlewares/upload");
const router = Router();

router.post("/test", multer, upload, productController.test);
router.get("/:id", productController.getProduct);
router.get("/", productController.getProducts);
router.post("/search", productController.getProductsByQuery);
router.post("/", multer, upload, productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.patch("/image/:id", multer, upload, productController.updatePicture);
router.delete("/:id", productController.deleteProduct);
router.post("/deletemanyproducts", productController.deleteManyProducts);
router.get("/export/excel", productController.exportExcel);
router.post(
  "/import/excel",
  multerExcel,
  upload,
  productController.importExcel
);

module.exports = router;
