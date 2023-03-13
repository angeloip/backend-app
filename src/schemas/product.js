const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", index: true },
    price: { type: Number, required: true, trim: true },
    stock: { type: Number, trim: true, default: 0 },
    description: { type: String, required: true, trim: true },
    observations: { type: [String], required: true, trim: true },
    picture: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dzgiu2txq/image/upload/v1677945017/picture/no-image_abom6f.jpg"
      },
      public_id: { type: String, default: "" }
    }
  },
  {
    timestamps: true
  }
);

productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.updatedAt;
  }
});

module.exports = model("Product", productSchema);
