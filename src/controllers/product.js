const { apriori } = require("../helpers/aprori");
const fs = require("fs-extra");

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
  createProduct: async (req, res, next) => {
    try {
      console.log(req.body);
      if (req.file) {
        await fs.remove(req.file.path);
        console.log(req.file);
      }

      return res.status(200).json("CREATE");
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      return res.status(200).json("UPDATE");
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
