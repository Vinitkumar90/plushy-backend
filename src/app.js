require("dotenv").config();
const express = require("express");
const connectDb = require("./config/database.js");
const User = require("./models/user.js");
const { validateSignupData, validateEmail } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(cookieParser());

//user signUp api
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    validateEmail(req);
    const { emailId, password } = req.body;
    //finding user by email hereeee
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    //comparing password
    const verify = await user.passwordCheck(password)
    if (!verify) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = await user.getJwt()  //token signed while login for a particular user
    res.cookie("token", token, {
      expires: new Date(Date.now()+ 8 * 3600000)
    }); //sending cookie with token having that users Id

    //successful login
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//get profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send("Error " + error.message);
  }
});

//send connection request
app.post("/sendConnectionRequest",userAuth,(req,res) => {
  try{
    const user = req.user;
    res.send(user.firstName+" sent u a connection request")
  }catch(error){
    res.send("Error: "+ error.message)
  }
})



const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server", error);
  }
};

startServer();
