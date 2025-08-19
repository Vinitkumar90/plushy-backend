const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

//send left or right swipe api call   //interested or ignored
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;

      //we will need to validate that we are sending request only to those toUserId present in the db ;)
      const presentDb = await User.findById(toUserId);
      if (!presentDb) {
        return res.status(404).json({
          message: "someone who is not present",
        });
      }

      //we will check if the status is either of these two types only
      const allowedStatus = ["ignored", "interested"];
      const checkStatus = allowedStatus.includes(status); //t or f
      if (!checkStatus) {
        return res.status(400).json({
          message: "This status is invalid",
        });
      }

      //we will also check if the request is already made OR the other person had made the request already
      const checkConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (checkConnection) {
        return res.status(400).json({
          message: "request already exists!",
        });
      }

      const connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      const data = await connectionRequest.save();
      
      res.json({
        message: `${req.user.firstName} ${status} ${presentDb.firstName}`,
        data,
      });
    } catch (error) {
      res.send("Error " + error.message);
    }
  }
);

//review the request [accept or reject]
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      //check the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({
          message: "Status is not allowed",
        });
      }

      //now check the request in db
      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        res.status(400).json({
          message: "Connection request not found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({
        message: "connection request",
        status,
        data,
      });
    } catch (error) {
      res.status(404).send("error: ", error.message);
    }
  }
);

module.exports = requestRouter;
