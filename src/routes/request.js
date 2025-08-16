const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

const requestRouter = express.Router();

//send left or right swipe api call
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
      if(!presentDb){
        res.status(404).json({
            message:"someone who is not present"
        })
      }

    
      //we will check if the status is either of these two types only
      const allowedStatus = ["ignored","interested"];
      const checkStatus = allowedStatus.includes(status); //t or f
      if(!checkStatus){
        res.status(400).json({
            message:"This status is invalid"
        })
      }

      //we will also check if the request is already made OR the other person had made the request already
      const checkConnection  = await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
      })
      if(checkConnection){
        res.status(400).json({
            message:"request already exists!"
        })
      }

      const connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} ${status} ${presentDb.firstName}`,
        data
      });
    } catch (error) {
      res.send("Error " + error.message);
    }
  }
);

module.exports = requestRouter;
