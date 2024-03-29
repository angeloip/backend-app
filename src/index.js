const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://192.168.1.2:3001"],
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

require("./connection");

const router = require("./routes")
app.use(router)


app.use((error, req, res, next) => {
  console.log("Error name: ", error.name);
  console.log("Error: ", error);
  console.log(error.message);
  return res.status(500).json({ msg: error.message });
});

app.get("/", (req, res) => {
  res.send("Server");
});

app.listen(PORT, () => {
  console.log(`El servidor está corriendo correctamente.`);
});
