const validator = require("validator")

const validateSignupData = (req) => {
    const {firstName,lastName,emailId,password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong")
    }
}

const validateEmail = (req) => {
    const {emailId} = req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
}

module.exports = {
    validateSignupData,
    validateEmail
}