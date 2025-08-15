const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

//send connection request
requestRouter.post("/sendConnectionRequest", userAuth, (req,res) => {
    try{
        const user = req.user;
        res.send(user.firstName+" sent you a connection request");
    }catch(error){
        res.send("Error: "+ error.message)
    }
})


module.exports  = requestRouter
