const express = require("express");
const router = express.Router();
const authController = require("../controller/authContoller");
const userController = require("../controller/userController");
const { privateRoute } = require("../middleware/privateRoute");
const upload = require("../utils/multer");

router.post("/signup", upload.fields("photo"), authController.signup);
router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(privateRoute);
router.patch("/", userController.changeUserData);
router.patch("/changePassword", authController.changePassword);

module.exports = router;
