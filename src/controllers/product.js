const { apriori } = require("../helpers/aprori");

const productController = {
  test: async (req, res, next) => {
    try {
      const { text } = req.body;
      const respuesta = await apriori(text);

      return res.status(200).json({ msg: respuesta });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
