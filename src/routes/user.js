// user Router

// get/user/requests
// get/user/connections
// get/user/feed -Gets you the profiles of other users on platform

const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName phtoUrl age gender about skills";

//1 loggedin user pending requests
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; //we get the logged in user
    const pendingRequest = await ConnectionRequest.find({
      //connection request document
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

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
          status: "accepted",
        },
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    //now we dont want to show us
    //we need to filter out data where fromUserId or toUserId is not us
    const connections = data.map((c) => {
      if (c.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return c.toUserId;
      } else {
        return c.fromUserId;
      }
    });
    res.status(200).json({
      message: "all of your connections",
      connections,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//feed of the logged in user
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    //user should see the cards except
    // - his own card
    // - his connections
    // - ignored people
    // - already sent connection
    // - basicaaalyyy all the people he has already interacted
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 10 ? 10 : limit;
    const skip = page - 1 * limit; //check api.md

    const loggedInUser = req.user;
    //now finding all the document where i was involved
    const noFeed = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId"); // no need of status , timestamps etc

    //now creating a set of these people...who are not allowed in feed
    const mySet = new Set(); // our own objectId and other user objectId

    noFeed.forEach((user) => {
      mySet.add(user.fromUserId.toString());
      mySet.add(user.toUserId.toString());
    });

    //okay now i need to select all the users except the users whose object id is saved in mySet
    const notInFeed = [...mySet];

    const finalPeople = await User.find({
      $and: [{ _id: { $nin: notInFeed } }, { _id: { $ne: loggedInUser._id } }],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "sent",
      finalPeople,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//no interaction virat,dhoni

module.exports = userRouter;
