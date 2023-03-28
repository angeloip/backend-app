const categorySchema = require("../schemas/category");
const productSchema = require("../schemas/product");

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
  getCountByCategory: async (req, res, next) => {
    try {
      const aggregate = [
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: "$category"
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            name: { $first: "$category.name" }
          }
        },
        { $project: { _id: 0 } }
      ];

      const countPerCategory = await productSchema.aggregate(aggregate);
      const sortData = countPerCategory.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      return res.status(200).json(sortData);
    } catch (error) {
      next(error);
    }
    y;
  },
  getCategoriesByQuery: async (req, res, next) => {
    try {
      const { query, order, key } = req.query;
      const limit = parseInt(req.query.limit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      const skip = (page - 1) * limit;

      const search = query
        ? {
            $or: [{ name: { $regex: query, $options: "$i" } }]
          }
        : {};

      const collectionSize = await categorySchema.countDocuments(search);
      let categories = null;

      if (
        key !== "" &&
        typeof key !== "undefined" &&
        order !== "" &&
        typeof order !== "undefined"
      ) {
        if (order === "asc" || order === "desc") {
          categories = await categorySchema
            .find(search)
            .sort([[key, order]])
            .skip(skip)
            .limit(limit);
        } else {
          categories = await categorySchema
            .find(search)
            .skip(skip)
            .limit(limit);
        }
      } else {
        categories = await categorySchema.find(search).skip(skip).limit(limit);
      }

      return res.status(200).json({
        docs: categories,
        total: collectionSize,
        offset: skip,
        limit: limit,
        page: page,
        totalPages: Math.ceil(collectionSize / limit)
      });
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

      const product = await productSchema.findOne({ category: category._id });

      if (product)
        return res.status(406).json({
          msg: "No es posible eliminar la categoría, ya que existe productos con dicha categoría"
        });

      await categorySchema.findByIdAndRemove(id);

      return res.status(200).json("DELETED");
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
