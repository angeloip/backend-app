const { Router } = require("express");
const orderController = require("../controllers/order");
const router = Router();

router.get("/:id", orderController.getOrder);
router.get("/", orderController.getOrders);
router.post("/search", orderController.getOrdersByQuery);
router.post("/", orderController.createOrder);

module.exports = router;
