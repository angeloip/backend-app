const jwt = require("jsonwebtoken");

const activation = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN, { expiresIn: "5m" });
};

const refresh = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "24h" });
};

const access = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
};

module.exports = { activation, refresh, access };
