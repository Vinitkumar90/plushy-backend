const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

//get profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send("Error " + error.message);
  }
});

//patch the profile
profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const updateUser = req.user;
    Object.keys(req.body).forEach((field) => updateUser[field] = req.body[field]);
    await updateUser.save()

    res.send(`${req.user.firstName} your profile has been updated`)
    res.json({
        message:`${req.user.firstName}, your profile updated successfuly`,
        data: updateUser,
    })
  } catch (error) {
    res.status(500).send("error"+error.message)
  }
});

//forget password api
//compare it with older hash using bcrypt.compare and then accept the neww password and update to db

module.exports = profileRouter;
