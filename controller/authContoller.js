const { asyncCatch } = require("../utils/asyncCatch");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const GlobalError = require("../error/GlobalError");
const sendEmail = require("../utils/email");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Email = require("../utils/email");
const cloudinary = require("../utils/cloudinary");

function signJWT(id) {
  const token = jwt.sign({ id: id }, process.env.JWT_SIGNATURE, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return token;
}

exports.signup = asyncCatch(async (req, res, next) => {
  console.log(req.files);
  return;
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: data.secure_url,
    imgId: data.public_id,
  });

  const url = `${req.protocol}://${req.get("host")}`;

  const emailHandler = new Email(user, url);
  await emailHandler.sendWelcome();

  const token = signJWT(user._id);

  res.json({ success: true, data: { user, token } });
});

exports.login = asyncCatch(async (req, res, next) => {
  //1) Check if email and password provided
  const { email, password } = req.body;

  if (!email || !password)
    return next(new GlobalError("Please provide email and password"));

  //2) Check if Email exist and password correct;
  const user = await User.findOne({ email }).select("+password"); //2

  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new GlobalError("Email or password incorrect"));

  //!Sign JWT
  const token = signJWT(user._id);

  res.json({ success: true, data: { token: token, user } });
});

exports.forgetPassword = asyncCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new GlobalError("User with this email does not exist", 404));

  const passwordToken = await user.generatePassToken();
  await user.save({ validateBeforeSave: false });

  const path = `${req.protocol}://${req.get("host")}/api/v1/${passwordToken}`;

  const emailHandler = new Email(user, path);
  await emailHandler.sendResetPassword();

  res.json({
    message: "Email sent",
    success: true,
  });
});

exports.resetPassword = asyncCatch(async (req, res, next) => {
  const token = req.params.token;

  const hashPassword = crypto.createHash("md5").update(token).digest("hex");

  const user = await User.findOne({
    forgetPassword: hashPassword,
    resetExpires: { $gt: new Date() },
  });

  if (!user) return next(new GlobalError("Token invalid or expired!", 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetExpires = undefined;
  user.forgetPassword = undefined;
  await user.save();

  const newToken = signJWT(user._id);

  res.status(201).json({
    success: true,
    token: newToken,
  });
});

exports.changePassword = asyncCatch(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const isPasswordCorrect = await user.checkPassword(
    req.body.currentPassword,
    user.password
  );

  if (!isPasswordCorrect)
    return next(new GlobalError("Incorrect old password!", 403));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.save();

  const token = signJWT(user._id);

  res.status(201).json({
    success: true,
    token,
  });
});
