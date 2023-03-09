const categorySchema = require("../schemas/category");

const categoryController = {
  getCategory: async (req, res, next) => {
    try {
      const { id } = req.params;

      const category = await categorySchema.findById(id);

      if (!category)
        return res.status(404).json({ msg: "Categoría no existente" });

      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  },
  getCategories: async (req, res, next) => {
    try {
      const categories = await categorySchema.find({});

      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },
  createCategory: async (req, res, next) => {
    try {
      const category = req.body;

      const newCategory = new categorySchema(category);
      await newCategory.save();

      return res.status(200).json("CREATED");
    } catch (error) {
      next(error);
    }
  },
  updateCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const newCategoryInfo = req.body;

      const category = await categorySchema.findById(id);

      if (!category)
        return res.status(404).json({ msg: "Categoría no existente" });

      await categorySchema.findByIdAndUpdate(id, newCategoryInfo, {
        new: true
      });

      return res.status(200).json("UPDATED");
    } catch (error) {
      next(error);
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params;

      const category = await categorySchema.findById(id);

      if (!category)
        return res.status(404).json({ msg: "Categoría no existente" });

      await categorySchema.findByIdAndRemove(id);

      return res.status(200).json("DELETED");
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
