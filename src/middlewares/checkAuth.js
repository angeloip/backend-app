const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) return res.status(400).json({ msg: "Autenticación fallida" });

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) return res.status(400).json({ msg: "Autenticación fallida" });

      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};
