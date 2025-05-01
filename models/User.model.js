import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName:{
        type: String,
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
              return ! value.includes(" ");
            },
            message: ({value}) => `"${value}" is not a valid username (cannot contain white-spaces)!`
          }
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim : true,
        required: true
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password should be minimum 8 characters long and should contain atleast one uppercase letter, one lowercase letter, one number and one special character")
            }
        }
    },
    dob:{
        type : Date,
        required : true,
        validate(value){
            if(value > Date.now()){
                throw new Error("DOB cannot not be a future date")
            }
        }
    },
    gender : {
        type: String,
        set : val => val.toLowerCase(),
        enum : ["male", "female", "others"],
        required: true
    },
    profilePic: {
        type: String,
        default: "",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL")
            }
        }

    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    about :{
        type : String,
        default : "I am a developer"
    },
    skills:{
        type : [String],
        default : ["programming","c++"]
    }

},
 {
    timestamps : true
 })


const User = mongoose.model("User", userSchema);

export default User;