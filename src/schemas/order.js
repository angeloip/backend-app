const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    products: { type: [String], required: true, trim: true },
    prices: { type: [Number], required: true, trim: true },
    quantities: { type: [Number], required: true, trim: true },
    totalprice: { type: Number, require: true, trim: true, index: true },
    state: { type: String, trim: true, default: "Pendiente", index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true, index: true }
  },
  {
    timestamps: true
  }
);

orderSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.updatedAt;
  }
});

module.exports = model("Order", orderSchema);
