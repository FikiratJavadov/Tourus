const express = require("express");
const router = express.Router();
const authController = require("../controller/authContoller");
const userController = require("../controller/userController");
const { privateRoute } = require("../middleware/privateRoute");

router.patch("/", privateRoute, userController.changeUserData);
router.patch("/changePassword", privateRoute, authController.changePassword);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router;
