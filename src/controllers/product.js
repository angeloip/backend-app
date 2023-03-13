const { apriori } = require("../helpers/aprori");
const fs = require("fs-extra");
const productSchema = require("../schemas/product");
const categorySchema = require("../schemas/category");
const {
  uploadPictureProduct,
  deletePictureProduct
} = require("../helpers/cloudinary");
const XLSX = require("xlsx");

const productController = {
  test: async (req, res, next) => {
    try {
      const products = await productSchema
        .find({}, { picture: 0 })
        .populate({ path: "category", select: { name: 1 } });

      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await productSchema.findById(id);

      if (!product)
        return res.status(404).json({ msg: "Producto no existente" });

      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },
  getProducts: async (req, res, next) => {
    try {
      const products = await productSchema.find({});

      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
  getProductsByQuery: async (req, res, next) => {
    try {
      const { query, order, key } = req.query;
      const limit = parseInt(req.query.limit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      const skip = (page - 1) * limit;

      const validate =
        key !== "" &&
        typeof key !== "undefined" &&
        order !== "" &&
        typeof order !== "undefined";

      const isCategory = key === "category" ? "category.name" : key;

      const options = validate
        ? [
            { $sort: { [isCategory]: order === "asc" ? 1 : -1 } },
            { $skip: skip },
            { $limit: limit }
          ]
        : [{ $skip: skip }, { $limit: limit }];

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
          $match: {
            $or: [
              { name: { $regex: query, $options: "$i" } },
              { "category.name": { $regex: query, $options: "$i" } }
            ]
          }
        },

        {
          $facet: {
            docs: [
              ...options,
              {
                $project: {
                  name: 1,
                  category: "$category.name",
                  price: 1,
                  stock: 1,
                  description: 1,
                  observations: 1,
                  picture: 1,
                  createdAt: 1
                }
              }
            ],
            totalCount: [
              {
                $count: "count"
              }
            ]
          }
        }
      ];

      const products = await productSchema.aggregate(aggregate);

      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
  auxQuery: async (req, res, next) => {
    try {
      const { query, order, key, option } = req.query;
      const limit = parseInt(req.query.limit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      const skip = (page - 1) * limit;

      const search = query
        ? {
            $or: [
              { name: { $regex: query, $options: "$i" } },
              { category: { $regex: query, $options: "$i" } },
              { description: { $regex: query, $options: "$i" } }
            ]
          }
        : {};

      const collectionSize = await productSchema.countDocuments(search);
      let products = null;

      if (
        key !== "" &&
        typeof key !== "undefined" &&
        order !== "" &&
        typeof order !== "undefined"
      ) {
        if (order === "asc" || order === "desc") {
          products = await productSchema
            .find(search)
            .sort([[key, order]])
            .skip(skip)
            .limit(limit);
        } else {
          products = await productSchema.find(search).skip(skip).limit(limit);
        }
      } else {
        products = await productSchema.find(search).skip(skip).limit(limit);
      }

      return res.status(200).json({
        docs: products,
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
  createProduct: async (req, res, next) => {
    try {
      const product = req.body;
      const { categoryId } = req.body;

      if (req.file) {
        const result = await uploadPictureProduct(req.file.path);
        await fs.remove(req.file.path);
        const image = {
          url: result.secure_url,
          public_id: result.public_id
        };
        product.picture = image;
      }

      const category = await categorySchema.findById(categoryId);

      product.category = category._id;
      delete product.categoryId;

      const newProduct = new productSchema(product);
      await newProduct.save();

      return res.status(200).json("CREATED");
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const newProductInfo = req.body;

      const product = await productSchema.findById(id);

      if (!product)
        return res.status(404).json({ msg: "Producto no existente" });

      await productSchema.findByIdAndUpdate(id, newProductInfo, {
        new: true
      });

      return res.status(200).json("UPDATED");
    } catch (error) {
      next(error);
    }
  },
  updatePicture: async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await productSchema.findById(id);

      if (!product)
        return res.status(404).json({ msg: "Producto no existente" });

      let image = null;

      if (product.picture.public_id === "") {
        const result = await uploadPictureProduct(req.file.path);
        await fs.remove(req.file.path);
        image = {
          url: result.secure_url,
          public_id: result.public_id
        };
      } else {
        await deletePictureProduct(product.picture.public_id);
        const result = await uploadPictureProduct(req.file.path);
        await fs.remove(req.file.path);
        image = {
          url: result.secure_url,
          public_id: result.public_id
        };
      }

      product.picture.url = image.url;
      product.picture.public_id = image.public_id;

      const updatedProduct = await productSchema.findByIdAndUpdate(
        id,
        product,
        {
          new: true
        }
      );

      return res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await productSchema.findById(id);

      if (!product)
        return res.status(404).json({ msg: "Producto no existente" });

      const deletedProduct = await productSchema.findByIdAndRemove(id);

      if (deletedProduct && deletedProduct.picture.public_id) {
        await deletePictureProduct(deletedProduct.picture.public_id);
      }

      return res.status(200).json("DELETED");
    } catch (error) {
      next(error);
    }
  },
  deleteManyProducts: async (req, res, next) => {
    try {
      const ids = req.body;

      await productSchema.deleteMany({
        _id: { $in: ids }
      });

      return res.status(200).json("OK");
    } catch (error) {
      next(error);
    }
  },
  exportExcel: async (req, res, next) => {
    try {
      const products = await productSchema
        .find({}, { picture: 0 })
        .populate({ path: "category", select: { name: 1 } });

      const workSheetColumnName = [
        "N°",
        "Id",
        "Nombre",
        "Categoría",
        "Precio",
        "Stock",
        "Descripción",
        "Observación",
        "Fecha de Creación"
      ];
      const data = products.map((element, index) => {
        const observations = element.observations.join(", ");
        const createdAt = new Date(element.createdAt).toLocaleString();
        return [
          index + 1,
          element._id.toString(),
          element.name,
          element.category.name,
          element.price,
          element.stock,
          element.description,
          observations,
          createdAt
        ];
      });

      const workSheetData = [workSheetColumnName, ...data];
      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "Productos");

      const binaryWorkbook = XLSX.write(workBook, {
        type: "buffer",
        bookType: "xlsx"
      });

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Productos.xlsx"`
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      return res.status(200).send(binaryWorkbook);
    } catch (error) {
      next(error);
    }
  },
  importExcel: async (req, res, next) => {
    try {
      const workBook = XLSX.readFile(req.file.path);
      const workBookSheets = workBook.SheetNames;
      const sheet = workBookSheets[0];
      const excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);

      const categories = await categorySchema.find({});

      const data = excelData.map((row) => {
        const observations = row.Observación.split(", ");
        const categoryId = categories.find(
          (element) => element.name === row.Categoría
        );
        return {
          name: row.Nombre,
          category: categoryId,
          price: row.Precio,
          stock: row.Stock,
          description: row.Descripción,
          observations
        };
      });

      await fs.remove(req.file.path);
      const importData = await productSchema.insertMany(data);

      return res.status(200).json(importData);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
