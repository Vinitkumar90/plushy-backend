// user Router

// get/user/requests
// get/user/connections
// get/user/feed -Gets you the profiles of other users on platform

const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName phtoUrl age gender about skills"

//1 loggedin user pending requests
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; //we get the logged in user
    const pendingRequest = await ConnectionRequest.find({
      //connection request document
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      USER_SAFE_DATA
    );

    res.status(200).json({
      message: "data sent successfully",
      data: pendingRequest,
    });
  } catch (error) {
    res.status(404).send("error: " + error.message);
  }
});

//2 loggedin user connections
userRouter.get("/user/total/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    //now we need to find all the connections (status:accepted)
    const data = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted"
        },
        {
          toUserId: loggedInUser._id,
          status:"accepted"
        },
      ],
    }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)
    //now we dont want to show us
    //we need to filter out data where fromUserId or toUserId is not us
    const connections = data.map((c) => {
        if(c.fromUserId._id.toString() === loggedInUser._id.toString()){
            return c.toUserId;
        }else{
            return c.fromUserId
        }
    })
    res.status(200).json({
        message:"all of your connections",
        connections
    })
  } catch (error) {
    res.status(404).send("error ", error.message);
  }
});



module.exports = userRouter;
