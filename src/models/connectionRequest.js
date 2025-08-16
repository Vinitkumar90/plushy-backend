const mongoose = require("mongoose");



const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        reuired: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message: "{VALUE} is invalid"
        }
    }
},{
    timestamps: true
})

connectionRequestSchema.index({fromUserId:1,toUserId:1})

connectionRequestSchema.pre("save", function(next){
    if(this.toUserId.equals(this.fromUserId)){
        throw new Error("Cannot send request to urself ;)")
    }
    next();
})

const ConnectionRequest = mongoose.model("connectionRequest",connectionRequestSchema);
module.exports = ConnectionRequest;

//status: ignored intersted accepted rejected