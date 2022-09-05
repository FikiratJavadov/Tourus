const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//name, email, photo, password, role

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name!"],
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      validate: [validator.isEmail, "Provide a correct email!"],
    },

    photo: String,

    password: {
      type: String,
      required: [true, "Please provide a password!"],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm the password!"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },

        message: "Passowrd are not the same",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.checkPassword = async function (
  realPassword,
  cryptedPassword
) {
  console.log(realPassword);
  console.log(cryptedPassword);
  return await bcrypt.compare(realPassword.toString(), cryptedPassword);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
