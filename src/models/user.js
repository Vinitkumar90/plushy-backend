const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required: true,
        minLength:4,
        maxLength: 50
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        unique:true,
        trim:true,
        required:true,
        lowercase:true
    },
    password:{
        type: String,
        required:true
    },
    age:{
        type: Number,
        min:18
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
    },
    about:{
        type:String,
        default: "This is the default about section"
    },
    skills:{
        type:[String]
    }
},{
    timestamps:true,
})

//Hey, I want to create a model (class) called User that follows this userSchema.
//model
const User = mongoose.model("User",userSchema);  //lowercase and plural collection name

module.exports = User;