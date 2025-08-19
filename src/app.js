require("dotenv").config();
const express = require("express");
const connectDb = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

const main = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server", error);
  }
};

main();
