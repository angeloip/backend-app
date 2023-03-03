const { Router } = require("express");
const userController = require("../controllers/user");
const { auth } = require("../middlewares/auth");
const multer = require("../middlewares/multer");
const upload = require("../middlewares/upload");
const router = Router();

router.post("/auth/register", userController.register);
router.post("/auth/login", userController.logIn);
router.post("/access", userController.accessToken);
router.post("/auth/forgot_pass", userController.forgotPassword);
router.post("/auth/reset_pass", auth, userController.resetPassword);
router.get("/auth/user", auth, userController.info);
router.patch("/auth/user_update", auth, userController.update);
router.get("/auth/signout", userController.signOut);
router.post("/auth/google_login", userController.googleLogin);
router.post("/upload_avatar", multer, upload, userController.uploadPicture);
router.post("/auth/verify_token", userController.verifyToken);

module.exports = router;
