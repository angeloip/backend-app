const { Router } = require("express");
const {
  register,
  logIn,
  accessToken,
  forgotPassword,
  resetPassword,
  info,
  update,
  signOut,
  googleLogin
} = require("../controllers/user");
const { auth } = require("../middlewares/auth");

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", logIn);
router.post("/auth/access", accessToken);
router.post("/auth/forgot_pass", forgotPassword);
router.post("/auth/reset_pass", auth, resetPassword);
router.get("/auth/user", auth, info);
router.patch("/auth/user_update", auth, update);
router.get("/auth/signout", signOut);
router.post("auth/google_login", googleLogin);

/* router.post("/", createUser);


router.get("/", getUsers);


router.get("/email/:email", getUserWithEmail);

router.get("/:id", getUser);


router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.get("/static/:param", getUserParams);

router.put("/resetpassword/:email", resetPasswordUser); */

module.exports = router;
