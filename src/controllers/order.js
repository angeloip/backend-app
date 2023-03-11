const orderSchema = require("../schemas/order");
const userSchema = require("../schemas/user");

const orderController = {
  createOrder: async (req, res, next) => {
    try {
      const order = req.body;
      const { userId } = req.body;

      const user = await userSchema.findById(userId);

      order.user = user._id;
      delete order.userId;

      const newOrder = new orderSchema(order);
      const createdOrder = await newOrder.save();

      user.orders = user.orders.concat(createdOrder._id);

      await user.save();

      return res.status(200).json("CREATED");
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;
