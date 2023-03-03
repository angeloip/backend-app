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
      await fs.remove(req.file.path);
      return res.status(200).json("OK");
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
