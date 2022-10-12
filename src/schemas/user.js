const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    mobile: { type: String, trim: true, default: "" },
    avatar: { type: String, default: "" },
    password: { type: String, required: true, trim: true },
    role: {
      type: String,
      trim: true,
      default: "user"
    },
    date: {
      type: Date,
      default: new Date()
    }
  },
  {
    timestamps: true
  }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.password;
  }
});

module.exports = model("User", userSchema);
