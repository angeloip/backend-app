const { Router } = require("express");
const categoryController = require("../controllers/category");
const router = Router();

router.get("/:id", categoryController.getCategory);
router.get("/", categoryController.getCategories);
router.post("/search", categoryController.getCategoriesByQuery);
router.post("/", categoryController.createCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
