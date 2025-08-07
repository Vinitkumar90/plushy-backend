const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
    },
    password:{
        type: String,
    },
    age:{
        type: String,
    },
    gender:{
        type: String,
    }
})

//Hey, I want to create a model (class) called User that follows this userSchema.
//model
const User = mongoose.model("User",userSchema);  //lowercase and plural collection name

module.exports = User;