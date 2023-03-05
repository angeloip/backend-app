const { apriori } = require("../helpers/aprori");
const fs = require("fs-extra");
const productSchema = require("../schemas/product");
const {
  uploadPictureProduct,
  deletePictureProduct
} = require("../helpers/cloudinary");

const productController = {
  test: async (req, res, next) => {
    try {
      const data = req.body;
      const respuesta = await apriori(data);
      return res.status(200).json({ msg: JSON.parse(respuesta) });
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
  createProduct: async (req, res, next) => {
    try {
      const product = req.body;

      if (req.file) {
        const result = await uploadPictureProduct(req.file.path);
        await fs.remove(req.file.path);
        const image = {
          url: result.secure_url,
          public_id: result.public_id
        };
        product.picture = image;
      }

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

      const updatedProduct = await productSchema.findByIdAndUpdate(
        id,
        newProductInfo,
        {
          new: true
        }
      );
      return res.status(200).json(updatedProduct);
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

      return res.status(200).json(deletedProduct);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
