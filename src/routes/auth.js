const express = require("express");
const { validateSignupData, validateEmail } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

//user signUp api
authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //now encrypting the password

    const hashedPass = await bcrypt.hash(password, 10);

    //creating a new user
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPass,
    });
    await newUser.save();
    res.send("User added Successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//user login api
authRouter.post("/login", async (req, res) => {
  try {
    validateEmail(req);
    const { emailId, password } = req.body;
    //finding user by email hereeee
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    //comparing password
    const verify = await user.passwordCheck(password);
    if (!verify) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = await user.getJwt(); //token signed while login for a particular user

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    }); //sending cookie with token having that users Id

    //successful login
    res.status(200).json({
      user,
      hey:"just checking"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//user logout
authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()), // set the exisiting token to null and immediately expiring the token cookie
    });
    res.status(200).json({
      message: "logout was successul",
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong during logout",
    });
  }
});

module.exports = authRouter;
