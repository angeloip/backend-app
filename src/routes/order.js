const { Router } = require("express");
const orderController = require("../controllers/order");
const router = Router();

router.post("/", orderController.createOrder);

module.exports = router;
