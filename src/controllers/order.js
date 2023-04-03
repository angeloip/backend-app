const orderSchema = require("../schemas/order");
const userSchema = require("../schemas/user");

const orderController = {
  getOrder: async (req, res, next) => {
    try {
      const { id } = req.params;

      const order = await orderSchema
        .findById(id)
        .populate({ path: "user", select: { name: 1, email: 1, mobile: 1 } });

      if (!order)
        return res.status(404).json({ msg: "Categoría no existente" });

      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
  getOrders: async (req, res, next) => {
    try {
      const order = await orderSchema
        .find({})
        .populate({ path: "user", select: { name: 1, email: 1, mobile: 1 } });

      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
  getOrdersByQuery: async (req, res, next) => {
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

      const isUser = key === "name" ? "user.name" : key;

      const options = validate
        ? [
            { $sort: { [isUser]: order === "asc" ? 1 : -1 } },
            { $skip: skip },
            { $limit: limit }
          ]
        : [{ $skip: skip }, { $limit: limit }];

      const aggregate = [
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $match: { "user.name": { $regex: query, $options: "$i" } }
        },

        {
          $facet: {
            docs: [
              ...options,
              {
                $project: {
                  user: { name: 1 },
                  products: 1,
                  prices: 1,
                  quantities: 1,
                  totalprice: 1,
                  state: 1,
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

      const orders = await orderSchema.aggregate(aggregate);

      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
  createOrder: async (req, res, next) => {
    try {
      const order = req.body;
      const { userId } = req.body;

      const user = await userSchema.findById(userId);

      if (!user)
        return res.status(404).json({ msg: "Usuario no autenticado" });

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
