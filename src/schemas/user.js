const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true
    },
    mobile: { type: String, trim: true, default: "" },
    picture: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dzgiu2txq/image/upload/v1665616153/avatar/blank_profile_picture_hf0cjj.png"
      },
      public_id: { type: String, default: "" }
    },
    password: { type: String, required: true, trim: true },
    role: {
      type: String,
      trim: true,
      default: "user"
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order"
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.updatedAt;
    delete returnedObject.password;
  }
});

module.exports = model("User", userSchema);
