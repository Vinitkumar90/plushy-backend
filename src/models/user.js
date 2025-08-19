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
      unique: true,  //this also sets the index as well as index: true
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
      enum:{
        values: ["male","female","others"],
        message : "{VALUE} is not supported"
      }
    },
    photoUrl: {
      type: String,
      default:"https://i.pinimg.com/236x/bb/d4/4b/bbd44b37f18e40a01543b8b4721b1cce.jpg",
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

// userSchema.index({firstName:1})
// userSchema.index({gender:1})

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
