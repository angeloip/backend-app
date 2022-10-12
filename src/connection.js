const mongoose = require("mongoose");

const dbConnect = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Conexión correcta a MongoDB");
    })
    .catch((error) => {
      console.log(error);
    });
};
dbConnect();
