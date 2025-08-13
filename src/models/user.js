const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "enter valid email",
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg",
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
        message: "enter proper url",
      },
    },
    about: {
      type: String,
      default: "This is the default about section",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = function () {
  const user = this
  const token = jwt.sign({ _id: user._id}, "randomriya", {
    expiresIn: "7d",
  });
  return token
};

userSchema.methods.passwordCheck = async function(passwordInput){
  const user = this;
  const hashedPassword = user.password;
  const result = await bcrypt.compare(passwordInput,hashedPassword)
  return result;
}



//Hey, I want to create a model (class) called User that follows this userSchema.
//model
const User = mongoose.model("User", userSchema); //lowercase and plural collection name

module.exports = User;
