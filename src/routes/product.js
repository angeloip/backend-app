const { Router } = require("express");
const productController = require("../controllers/product");
const checkAuth = require("../middlewares/checkAuth");
const multer = require("../middlewares/multer");
const multerExcel = require("../middlewares/multerExcel");
const upload = require("../middlewares/upload");
const router = Router();

router.post("/apriori", productController.apriori);
router.get("/:id", productController.getProduct);
router.get("/", productController.getProducts);
router.post("/category", productController.getProductsByCategory);
router.post("/search", productController.getProductsByQuery);
router.post("/", checkAuth, multer, upload, productController.createProduct);
router.patch("/:id", checkAuth, productController.updateProduct);
router.patch(
  "/image/:id",
  checkAuth,
  multer,
  upload,
  productController.updatePicture
);
router.delete("/:id", checkAuth, productController.deleteProduct);
router.post(
  "/deletemanyproducts",
  checkAuth,
  productController.deleteManyProducts
);
router.get("/export/excel", checkAuth, productController.exportExcel);
router.post(
  "/import/excel",
  checkAuth,
  multerExcel,
  upload,
  productController.importExcel
);
router.get("/generate/report", checkAuth, productController.generateReport);

module.exports = router;
