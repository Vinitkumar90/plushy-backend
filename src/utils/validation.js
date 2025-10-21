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

const validateEditProfileData = (req) => {
    const allowedFields = ["gender","photoUrl","about","age"]
    const requestedFields = Object.keys(req.body);

    const invalidFields = requestedFields.filter((field) => !allowedFields.includes(field))
    if(invalidFields.length > 0){
        return false;
    }
    return true;
  
}

module.exports = {
    validateSignupData,
    validateEmail,
    validateEditProfileData
}