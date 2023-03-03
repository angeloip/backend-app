const { apriori } = require("../helpers/aprori");

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
      console.log("lLEGÓ");
      console.log(req.body);
      console.log("MMSI");
      return res.status(200).json("OK");
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
