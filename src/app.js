const express = require("express");
const app = express();
const connectDb = require("./config/database.js");
const User = require("./models/user.js");

app.post("/signup", async (req, res) => {
  const newUser = new User({
    firstName: "virat",
    lastName: "kohli",
    emailId: "virat@kohli.com",
    password: "viratk@123",
    age: "31",
    gender: "male",
  });

  try {
    await newUser.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(500).send("failed to save user");
  }
});

connectDb()
  .then(() => {
    console.log("connection established to the cluster");
    app.listen(7000, () => {
      console.log("app listening on port 7000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
