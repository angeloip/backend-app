const { Router } = require("express");
const categoryController = require("../controllers/category");
const checkAuth = require("../middlewares/checkAuth");
const router = Router();

router.get("/:id", categoryController.getCategory);
router.get("/", categoryController.getCategories);
router.get("/count/category", categoryController.getCountByCategory);
router.post("/search", categoryController.getCategoriesByQuery);
router.post("/", checkAuth, categoryController.createCategory);
router.patch("/:id", checkAuth, categoryController.updateCategory);
router.delete("/:id", checkAuth, categoryController.deleteCategory);

module.exports = router;
