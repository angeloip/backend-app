const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

require("./connection");

const userRoute = require("./routes/user");

app.use("/api/user", userRoute);

app.use((error, req, res, next) => {
  console.log("Error name: ", error.name);
  console.log("Error: ", error);
  console.log(error.message);
  return res.status(500).json({ message: error.message });
});

app.get("/", (req, res) => {
  res.send("Server");
});

app.listen(PORT, () => {
  console.log(`El servidor está corriendo correctamente.`);
});
