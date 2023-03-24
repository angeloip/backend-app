const { Router } = require("express");
const userController = require("../controllers/user");
const checkAuth = require("../middlewares/checkAuth");
const multer = require("../middlewares/multer");
const upload = require("../middlewares/upload");
const router = Router();

router.post("/auth/register", userController.register);
router.post("/auth/login", userController.logIn);
router.post("/access", userController.accessToken);
router.post("/auth/forgot_pass", userController.forgotPassword);
router.post("/auth/reset_pass", checkAuth, userController.resetPassword);
router.get("/auth/user", checkAuth, userController.getUser);
router.patch("/auth/user_update", checkAuth, userController.updateUser);
router.get("/auth/signout", userController.signOut);
router.post("/auth/google_login", userController.googleLogin);
router.post("/upload_avatar", multer, upload, userController.uploadPicture);
router.post("/auth/verify_token", userController.verifyToken);
router.post("/search", userController.getUsersByQuery);

module.exports = router;
