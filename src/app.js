require("dotenv").config()
const express = require("express");
const connectDb = require("./config/database.js");
const User = require("./models/user.js");

const app = express();
const PORT = process.env.PORT || 7000


app.use(express.json());

app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);
  console.log(newUser);

  try {
    await newUser.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(500).send("failed to save user");
  }
});

//get the user with a specific email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length == 0) {
      res.send("user not found");
    } else {
      res.send(userEmail);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

//get feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch {
    res.status(404).send("something went wrong");
  }
});

//delete user by id and delete
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findOneAndDelete({ _id: userId });
    res.send("user deleted successfully");
  } catch (err) {
    res.status(404).send("user not found");
  }
});

//update with the help of id passed
app.patch("/user", async (req, res) => {
  const { userId, ...data } = req.body;
  try {
    const change = await User.findByIdAndUpdate(userId, data, {
      new: false,
      runValidators: true,
    });
    console.log(change);
    res.send("successfully updated");
  } catch (err) {
    res.status(404).send("error updating...");
  }
});


const startServer = async() => {
  try{
    await connectDb();
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    })
  }
  catch(error){
    console.error("Failed to start the server",error)
  }
}

startServer();