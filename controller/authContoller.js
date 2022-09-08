const { asyncCatch } = require("../utils/asyncCatch");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const GlobalError = require("../error/GlobalError");
const sendEmail = require("../utils/email");
const bcrypt = require("bcryptjs");

function signJWT(id) {
  const token = jwt.sign({ id: id }, process.env.JWT_SIGNATURE, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return token;
}

exports.signup = asyncCatch(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

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

  res.json({ success: true, data: { token: token } });
});

exports.forgetPassword = asyncCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new GlobalError("User with this email does not exist", 404));

  const passwordToken = await user.generatePassToken();
  await user.save({ validateBeforeSave: false });

  const path = `Please follow the linke to change passwor: ${
    req.protocol
  }://${req.get("host")}/api/v1/${passwordToken}`;

  await sendEmail({
    email: user.email,
    subject: "Change password!",
    message: path,
  });

  res.json({
    success: true,
  });
});

exports.resetPassword = asyncCatch(async (req, res, next) => {
  const token = req.params.token;

  // const isSame = await bcrypt.compare(token);
});
